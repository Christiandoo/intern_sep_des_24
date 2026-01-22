export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userRoles = await prisma.userRole.findMany({
      select: {
        user: {
          select: {
            id: true,
            username: true, 
          },
        },
        role: {
          select: {
            id: true,
            name: true, 
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: userRoles });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
