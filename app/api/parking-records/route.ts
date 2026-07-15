import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

export async function GET() {
  try {
    const records = await prisma.parkingRecord.findMany({
      include: {
        vehicle: true,
        parkingSlot: true,
      },
      orderBy: {
        checkInTime: "desc",
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET RECORDS ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch parking records.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { vehicleId, parkingSlotId } = body;

    if (!vehicleId || !parkingSlotId) {
      return NextResponse.json(
        {
          message: "Vehicle and parking slot are required.",
        },
        {
          status: 400,
        }
      );
    }

    // Check vehicle exists
    const vehicle = await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
    });

    if (!vehicle) {
      return NextResponse.json(
        {
          message: "Vehicle not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Check slot exists
    const slot = await prisma.parkingSlot.findUnique({
      where: {
        id: parkingSlotId,
      },
    });

    if (!slot) {
      return NextResponse.json(
        {
          message: "Parking slot not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Check slot availability
    if (slot.status === "OCCUPIED") {
      return NextResponse.json(
        {
          message: "Parking slot is already occupied.",
        },
        {
          status: 400,
        }
      );
    }

    // Create parking record
    const record = await prisma.parkingRecord.create({
      data: {
        vehicleId,
        parkingSlotId,
      },
    });

    // Mark slot occupied
    await prisma.parkingSlot.update({
      where: {
        id: parkingSlotId,
      },
      data: {
        status: "OCCUPIED",
      },
    });

    // Audit log
    await logAction(
      "Administrator",
      `Checked in vehicle ${vehicle.numberPlate}`
    );

    return NextResponse.json(record, {
      status: 201,
    });

  } catch (error) {
    console.error("CHECK-IN ERROR:", error);

    return NextResponse.json(
      {
        message: "Check-in failed.",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}