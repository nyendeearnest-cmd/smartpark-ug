import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        fullName: "asc",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load users.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await req.json();

    const {
      fullName,
      email,
      password,
      role,
    } = body;

    if (!fullName || !email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    const exists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (exists) {
      return NextResponse.json(
        {
          message: "Email already exists.",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
      },
    });

    return NextResponse.json(user, {
      status: 201,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to create user.",
      },
      {
        status: 500,
      }
    );
  }
}