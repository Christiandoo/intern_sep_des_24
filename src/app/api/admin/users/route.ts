// src/app/api/admin/users/route.ts
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const roles = session?.roles ?? [];

    // 🔒 ADMIN ONLY
    if (!roles.includes("admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // ✅ schema kamu: implicit many-to-many user <-> role
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        roles: {
          select: {
            name: true,
          },
        },
      },
    });

    // format untuk dashboard
    const result = users.map((u) => ({
      id: u.id,
      email: u.email,
      username: u.username,
      roles: u.roles.map((r) => r.name),
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
