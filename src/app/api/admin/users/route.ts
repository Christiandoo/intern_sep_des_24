import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const roles = session?.roles ?? [];

    // 🔒 HANYA ADMIN
    if (!roles.includes("admin")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userRoles = await prisma.userRole.findMany({
      select: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });

    // 🔁 FORMAT UNTUK DASHBOARD
    const users = userRoles.map((ur) => ({
      id: ur.user.id,
      email: ur.user.email,
      username: ur.user.username,
      roles: [ur.role.name],
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
