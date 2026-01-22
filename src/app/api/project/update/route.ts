import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadFile, deleteFile } from "@/lib/storage";

export async function PATCH(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json(
        { success: false, message: "Project ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;
    const dateStarted = formData.get("dateStarted") as string | null;
    const dateEnded = formData.get("dateEnded") as string | null;
    const userId = formData.get("userId") as string | null;
    const roleId = formData.get("roleId") as string | null;
    const file = formData.get("file") as File | null;

    const oldProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!oldProject) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    let workOrder = oldProject.workOrder;

    // 🔥 UPLOAD FILE BARU (OPTIONAL)
    if (file && file.size > 0) {
      // hapus file lama
      if (workOrder) {
        await deleteFile(workOrder);
      }

      // upload file baru
      workOrder = await uploadFile(file, "projects/");
    }

    await prisma.project.update({
      where: { id: projectId },
      data: {
        name: name || undefined,
        description: description || undefined,
        start: dateStarted ? new Date(dateStarted) : undefined,
        end: dateEnded ? new Date(dateEnded) : undefined,
        userId: userId || undefined,
        roleId: roleId || undefined,
        workOrder,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (error: any) {
    console.error("UPDATE PROJECT ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
