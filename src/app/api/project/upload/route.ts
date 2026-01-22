export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { uploadFile } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const dateStarted = formData.get("dateStarted") as string;
    const dateEnded = formData.get("dateEnded") as string;
    const userId = formData.get("userId") as string;
    const roleId = formData.get("roleId") as string;
    const file = formData.get("file") as File | null;

    // 🔴 VALIDASI FIELD WAJIB
    if (
      !name ||
      !dateStarted ||
      !dateEnded ||
      !userId ||
      !roleId ||
      !file
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua field dan file wajib diisi",
        },
        { status: 400 }
      );
    }

    // 🔴 VALIDASI FILE DASAR (BEBAS FORMAT)
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "File tidak valid",
        },
        { status: 400 }
      );
    }

    // 🔥 1. UPLOAD FILE KE SUPABASE (WAJIB BERHASIL)
    const workOrderUrl = await uploadFile(file, "projects/");

    // 🔥 2. SIMPAN PROJECT + URL FILE
    const project = await prisma.project.create({
      data: {
        name,
        description,
        start: new Date(dateStarted),
        end: new Date(dateEnded),
        userId,
        roleId,
        workOrder: workOrderUrl, // 🔥 URL SUPABASE
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project berhasil dibuat",
      data: project,
    });
  } catch (error: any) {
    console.error("UPLOAD PROJECT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal membuat project",
      },
      { status: 500 }
    );
  }
}
