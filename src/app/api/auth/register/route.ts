export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const ALLOWED_ROLES = ["admin", "manager", "specialist"] as const;

export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    // ✅ Cek email
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Cek username
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json(
        { message: "Username already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        id: randomUUID(),       // WAJIB
        username,
        email,
        passwordHash: hashedPassword,
        updatedAt: new Date(),  // WAJIB
        roles: {
          connectOrCreate: {
            where: { name: role },
            create: { id: randomUUID(), name: role },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
