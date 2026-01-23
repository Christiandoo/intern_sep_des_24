// src/app/api/assignment/create/route.ts
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const title = formData.get("title");
    const userId = formData.get("userId");
    const projectId = formData.get("projectId");

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, message: "Invalid assignment title" },
        { status: 400 }
      );
    }

    if (typeof userId !== "string" || typeof projectId !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid user or project" },
        { status: 400 }
      );
    }

    const assignment = await prisma.assignment.create({
      data: {
        id: randomUUID(),
        title,
        userId,
        projectId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Assignment added",
        data: assignment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Create assignment failed" },
      { status: 500 }
    );
  }
}
