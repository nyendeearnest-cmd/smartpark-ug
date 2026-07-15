import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const records = await prisma.parkingRecord.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        vehicle: true,
        parkingSlot: true,
      },
      orderBy: {
        checkOutTime: "desc",
      },
    });

    const totalRevenue = records.reduce(
      (sum, record) =>
        sum + Number(record.amountCharged ?? 0),
      0
    );

    return NextResponse.json({
      totalRevenue,
      totalCompleted: records.length,
      records,
    });

  } catch (error) {

    console.error(
      "REPORT ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to load reports",
      },
      {
        status: 500,
      }
    );
  }
}