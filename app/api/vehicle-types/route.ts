import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicleTypes = await prisma.vehicleType.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(vehicleTypes);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicle types.",
      },
      { status: 500 }
    );
  }
}