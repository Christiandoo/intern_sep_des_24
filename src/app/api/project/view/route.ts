export const dynamic = "force-dynamic";

import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      select: {
       id:true,
       name:true,
       start:true,
       end:true,
       description:true,
      },
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
