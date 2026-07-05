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

    const { slotNumber, zone, status, condition } = body;

    const slot = await prisma.parkingSlot.update({
      where: { id },
      data: {
        slotNumber,
        zone,
        status,
        condition,
      },
    });

    return NextResponse.json(slot);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to update parking slot." },
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

    await prisma.parkingSlot.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Parking slot deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete parking slot.",
      },
      {
        status: 500,
      }
    );
  }
}