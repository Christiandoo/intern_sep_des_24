export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const userId = params.id;

    // ❌ cegah hapus diri sendiri
     if (session?.user?.id === userId) {
      return NextResponse.json(
        { message: "You cannot delete your own account" },
        { status: 403 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

   // putuskan relasi role dulu (implicit M2M)
await prisma.user.update({
  where: { id: userId },
  data: {
    roles: {
      set: [],
    },
  },
});

// hapus user
await prisma.user.delete({
  where: { id: userId },
});
    // hapus user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
