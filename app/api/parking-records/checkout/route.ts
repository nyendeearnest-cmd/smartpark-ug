import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { recordId } = await req.json();

    if (!recordId) {
      return NextResponse.json(
        { message: "recordId is required" },
        { status: 400 }
      );
    }

    const record = await prisma.parkingRecord.findUnique({
      where: { id: recordId },
      include: {
        parkingSlot: true,
      },
    });

    if (!record || record.checkOutTime) {
      return NextResponse.json(
        { message: "Invalid parking record" },
        { status: 400 }
      );
    }

    const checkOutTime = new Date();

    // duration in minutes
    const durationMs =
      checkOutTime.getTime() -
      record.checkInTime.getTime();

    const durationMinutes = Math.ceil(
      durationMs / 60000
    );

    // simple billing rule (we can upgrade later)
    const ratePerHour = 2000;
    const amountCharged =
      Math.ceil(durationMinutes / 60) * ratePerHour;

    // update record
    const updated = await prisma.parkingRecord.update({
      where: { id: recordId },
      data: {
        checkOutTime,
        durationMinutes,
        amountCharged,
        status: "COMPLETED",
      },
    });

    // free slot
    await prisma.parkingSlot.update({
      where: { id: record.parkingSlotId },
      data: { status: "AVAILABLE" },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "Checkout failed" },
      { status: 500 }
    );
  }
}