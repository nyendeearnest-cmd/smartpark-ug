import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load audit logs.",
      },
      {
        status: 500,
      }
    );
  }
}