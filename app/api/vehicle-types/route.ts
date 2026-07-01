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
    console.error("Error fetching vehicle types:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch vehicle types.",
      },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, firstHourRate, additionalHourRate } = body;

    if (!name || firstHourRate == null || additionalHourRate == null) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        { status: 400 }
      );
    }

    const vehicleType = await prisma.vehicleType.create({
      data: {
        name,
        firstHourRate,
        additionalHourRate,
      },
    });

    return NextResponse.json(vehicleType, { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle type:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create vehicle type.",
      },
      { status: 500 }
    );
  }
}