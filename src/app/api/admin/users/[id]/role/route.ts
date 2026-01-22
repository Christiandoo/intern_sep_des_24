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

    // 🔍 cek user
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // 🔍 cari role
    const roleData = await prisma.role.findUnique({
      where: { name: role },
    });

    if (!roleData) {
      return NextResponse.json(
        { message: "Role not found" },
        { status: 400 }
      );
    }

    // 🔥 TRANSACTION BIAR AMAN
    await prisma.$transaction([
      prisma.userRole.deleteMany({
        where: { userId: params.id },
      }),
      prisma.userRole.create({
        data: {
          userId: params.id,
          roleId: roleData.id,
        },
      }),
    ]);

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
