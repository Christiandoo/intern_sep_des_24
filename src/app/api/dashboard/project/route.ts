// src/app/api/dashboard/project/route.ts
export const dynamic = "force-dynamic";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ambil user + roles
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        roles: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const roleIds = user.roles.map((r) => r.id);

    // ambil project berdasarkan role user
    const projects = await prisma.project.findMany({
      where: {
        roleId: {
          in: roleIds,
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
