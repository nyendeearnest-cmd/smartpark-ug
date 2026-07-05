import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find parking record
    const record = await prisma.parkingRecord.findUnique({
      where: {
        id,
      },
      include: {
        vehicle: {
          include: {
            vehicleType: true,
          },
        },
        parkingSlot: true,
      },
    });

    if (!record) {
      return NextResponse.json(
        {
          message: "Parking record not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (record.status === "COMPLETED") {
      return NextResponse.json(
        {
          message: "Vehicle has already been checked out.",
        },
        {
          status: 400,
        }
      );
    }

    const checkOutTime = new Date();

    const durationMinutes = Math.max(
      1,
      Math.ceil(
        (checkOutTime.getTime() - record.checkInTime.getTime()) /
          (1000 * 60)
      )
    );

    const hours = Math.ceil(durationMinutes / 60);

    const firstHourRate = Number(record.vehicle.vehicleType.firstHourRate);
    const additionalHourRate = Number(
      record.vehicle.vehicleType.additionalHourRate
    );

    let amountCharged = firstHourRate;

    if (hours > 1) {
      amountCharged += (hours - 1) * additionalHourRate;
    }

    const updatedRecord = await prisma.parkingRecord.update({
      where: {
        id,
      },
      data: {
        checkOutTime,
        durationMinutes,
        amountCharged,
        status: "COMPLETED",
      },
      include: {
        vehicle: true,
        parkingSlot: true,
      },
    });

    await prisma.parkingSlot.update({
      where: {
        id: record.parkingSlotId,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    return NextResponse.json(updatedRecord);
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        message: "Checkout failed.",
        error: error instanceof Error ? error.message : String(error),
      },
      {
        status: 500,
      }
    );
  }
}