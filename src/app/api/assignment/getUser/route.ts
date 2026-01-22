export const dynamic = "force-dynamic";
import { prisma } from '@/lib/prisma';
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({   
        select: {
            id: true,
            username: true, 
          }   
         });
         console.log("Fetched users:", users); 
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
