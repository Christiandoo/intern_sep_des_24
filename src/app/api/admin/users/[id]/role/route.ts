// src/app/api/admin/users/[id]/role/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { role } = await req.json();

    if (!role || typeof role !== "string") {
      return NextResponse.json(
        { message: "Role is required" },
        { status: 400 }
      );
    }

    // cek user
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: { roles: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // cek role
    const roleData = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleData) {
      return NextResponse.json(
        { message: "Role not found" },
        { status: 400 }
      );
    }

    // update role (schema kamu MANY-TO-MANY TANPA userRole table)
    await prisma.user.update({
      where: { id: params.id },
      data: {
        roles: {
          set: [{ id: roleData.id }], // hapus role lama, set role baru
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update role" },
      { status: 500 }
    );
  }
}
