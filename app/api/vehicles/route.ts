import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        vehicleType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    const vehicle = await prisma.vehicle.create({
      data: {
        numberPlate,
        driverName,
        driverPhone,
        vehicleTypeId,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}