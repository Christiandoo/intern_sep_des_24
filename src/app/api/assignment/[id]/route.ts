// Import NextResponse dan Prisma client
export const dynamic = "force-dynamic";
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

    const assignment = await prisma.assignment.findUnique({
      where: { id }, 
       include: {
        user: {
          select: {
            username: true, 
          },
        },
      },
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "assignment not found!",
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
        message: "assignment details retrieved successfully",
        data: assignment,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving assignment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while retrieving the assignment",
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(request:any) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  const { title } = await request.json();

  try {
    const assignment = await prisma.assignment.update({
      where: {
        id,
      },
      data: {
        title: title
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data Post Updated!",
        data: assignment,
      },
      {
        status: 200,
      }
    );
  } catch (error:any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update data! assignment not found or invalid ID.",
        error: error.message,
      },
      {
        status: 400,
      }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id },
     
    });

    if (!assignment) {
      return NextResponse.json(
        {
          success: false,
          message: "assignment not found",
          data: null,
        },
        {
          status: 404,
        }
      );
    }
    await prisma.assignment.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data Post Deleted!",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error deleting assignment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete data! assignment not found or invalid ID.",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}