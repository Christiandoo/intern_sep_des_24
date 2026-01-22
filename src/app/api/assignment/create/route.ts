
export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get('title');
    const userId = formData.get('userId');
    const projectId = formData.get('projectId');

   
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ success: false, message: "Invalid assignment title" }, { status: 400 });
    }
    if (typeof userId !== "string" || typeof projectId !== "string") {
        return NextResponse.json({ success: false, message: "Invalid user or project" }, { status: 400 });
      }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        userId,
        projectId
      },
    });

    console.log("Project created:", assignment);

    return NextResponse.json({
      success: true,
      title: assignment.title,
      message: "Assignment added."
    });

  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, message: "upload failed" }, { status: 500 });
  }
}
