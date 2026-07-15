import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAction } from "@/lib/audit";

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
        (checkOutTime.getTime() -
          record.checkInTime.getTime()) /
          (1000 * 60)
      )
    );

    // Get system settings
    const settings =
      await prisma.systemSetting.findFirst();

    const gracePeriod =
      settings?.gracePeriod ?? 15;

    let amountCharged = 0;

    if (durationMinutes > gracePeriod) {
      const hours = Math.ceil(
        durationMinutes / 60
      );

      const firstHourRate = Number(
        record.vehicle.vehicleType.firstHourRate
      );

      const additionalHourRate = Number(
        record.vehicle.vehicleType
          .additionalHourRate
      );

      amountCharged = firstHourRate;

      if (hours > 1) {
        amountCharged +=
          (hours - 1) *
          additionalHourRate;
      }
    }

    // Update parking record
    const updatedRecord =
      await prisma.parkingRecord.update({
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

    // Free parking slot
    await prisma.parkingSlot.update({
      where: {
        id: record.parkingSlotId,
      },
      data: {
        status: "AVAILABLE",
      },
    });

    // Audit Log
    await logAction(
      "Administrator",
      `Checked out vehicle ${record.vehicle.numberPlate}`
    );

    return NextResponse.json(updatedRecord);

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        message: "Checkout failed.",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}