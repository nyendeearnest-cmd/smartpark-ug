import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const {
      fullName,
      email,
      password,
      role,
    } = body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updateData: {
      fullName: string;
      email: string;
      role: string;
      password?: string;
    } = {
      fullName,
      email,
      role,
    };

    if (password && password.trim() !== "") {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update user.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: Context
) {
  try {
    const { id } = await params;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to delete user.",
      },
      {
        status: 500,
      }
    );
  }
}