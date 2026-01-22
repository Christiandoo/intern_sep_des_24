import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const ALLOWED_ROLES = ["admin", "manager", "specialist"];

export async function POST(req: Request) {
  try {
    const { username, email, password, role } = await req.json();

    // 1️⃣ Validasi input
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

    // 2️⃣ Cek email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user + role (SESUAI SCHEMA)
    await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        roles: {
          create: {
            role: {
              connect: {
                name: role, // admin | manager | specialist
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export function OPTIONS() {
  return NextResponse.json({ message: "OK" }, { status: 200 });
}
