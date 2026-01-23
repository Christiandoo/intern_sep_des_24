// src/app/api/project/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";
import { parseISO, startOfDay } from "date-fns";

/* =======================
   GET PROJECT BY ID
   ======================= */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required", data: null },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        role: {
          select: {
            name: true,
          },
        },
        assignment: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    console.error("GET PROJECT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get project" },
      { status: 500 }
    );
  }
}

/* =======================
   UPDATE PROJECT (PATCH)
   ======================= */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const start = formData.get("dateStarted") as string | null;
    const end = formData.get("dateEnded") as string | null;
    const roleId = formData.get("roleId") as string | null;

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (start) startDate = startOfDay(parseISO(start));
    if (end) endDate = startOfDay(parseISO(end));

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    let filePath = existingProject.workOrder;

    if (file instanceof Blob) {
      if (filePath) {
        await deleteFile(filePath);
      }
      filePath = await uploadFile(file, "project/");
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: {
        name: name ?? undefined,
        description: description ?? undefined,
        workOrder: filePath ?? undefined,
        start: startDate,
        end: endDate,
        roleId: roleId ?? undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("PATCH PROJECT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update project" },
      { status: 500 }
    );
  }
}

/* =======================
   DELETE PROJECT
   ======================= */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { success: false, message: "ID is required" },
      { status: 400 }
    );
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id },
      select: { workOrder: true },
    });

    if (!project) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    if (project.workOrder) {
      await deleteFile(project.workOrder);
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PROJECT ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete project" },
      { status: 500 }
    );
  }
}
