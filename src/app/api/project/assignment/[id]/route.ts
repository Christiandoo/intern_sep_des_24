import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID is required",
          data: null,
        },
        {
          status: 400,
        }
      );
    }
    console.log("ID from request:", id);

    const project = await prisma.project.findUnique({
      where: { id },
      select:{
        assignments:{
            include:{
                user:{
                    select:{
                    username:true
                }

                }
            }
        }
      },
    });
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found!",
          data: null,
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project details retrieved successfully",
        data: project,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving project:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving the project",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}