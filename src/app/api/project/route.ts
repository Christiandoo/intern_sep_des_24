export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    // =========================
    // DETAIL PROJECT
    // =========================
    if (id) {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          role: true,
          assignment: {
            include: {
              user: {
                select: {
                  id: true,
                  username: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      return NextResponse.json({ success: true, data: project });
    }

    // =========================
    // PROJECT BY USER
    // =========================
    if (userId) {
      const projects = await prisma.project.findMany({
        where: {
          assignment: {
            some: {
              userId,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, data: projects });
    }

    // =========================
    // ALL PROJECTS
    // =========================
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        role: true,
        assignment: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("PROJECT API ERROR:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch project", data: null },
      { status: 500 }
    );
  }
}
