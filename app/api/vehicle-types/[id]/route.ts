import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// UPDATE
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

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

    const updatedVehicleType = await prisma.vehicleType.update({
      where: { id },
      data: {
        name,
        firstHourRate,
        additionalHourRate,
      },
    });

    return NextResponse.json(updatedVehicleType);
  } catch (error) {
    console.error("Error updating vehicle type:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update vehicle type.",
      },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.vehicleType.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Vehicle type deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting vehicle type:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete vehicle type.",
      },
      { status: 500 }
    );
  }
}