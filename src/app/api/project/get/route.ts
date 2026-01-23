// src/app/api/project/getRoles/route.ts
export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        roles: {
          select: { id: true, name: true },
        },
      },
    });

    // Flatten: tiap role jadi satu entry UserRole
    const userRoles = users.flatMap(user =>
      user.roles.map(role => ({
        user: { id: user.id, username: user.username },
        role: { id: role.id, name: role.name },
      }))
    );

    return NextResponse.json({ success: true, data: userRoles });
  } catch (error) {
    console.error("Error fetching user roles:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user roles", data: [] },
      { status: 500 }
    );
  }
}
