// src/app/api/project/assignment/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID is required",
          data: null,
        },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      select: {
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
        {
          success: false,
          message: "Project not found!",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project assignments retrieved successfully",
        data: project.assignment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving project assignments:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving the project assignments",
        data: null,
      },
      { status: 500 }
    );
  }
}
