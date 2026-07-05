import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      numberPlate,
      driverName,
      driverPhone,
      vehicleTypeId,
    } = body;

    if (!numberPlate || !driverName || !vehicleTypeId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: {
        numberPlate,
        driverName,
        driverPhone,
        vehicleTypeId,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to update vehicle" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.vehicle.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete vehicle" },
      { status: 500 }
    );
  }
}