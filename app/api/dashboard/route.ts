import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalVehicles = await prisma.vehicle.count();

    const totalSlots = await prisma.parkingSlot.count();

    const availableSlots = await prisma.parkingSlot.count({
      where: {
        status: "AVAILABLE",
      },
    });

    const occupiedSlots = await prisma.parkingSlot.count({
      where: {
        status: "OCCUPIED",
      },
    });

    const activeParking = await prisma.parkingRecord.count({
      where: {
        status: "ACTIVE",
      },
    });

    const completedParking = await prisma.parkingRecord.count({
      where: {
        status: "COMPLETED",
      },
    });

    const revenue = await prisma.parkingRecord.aggregate({
      _sum: {
        amountCharged: true,
      },
      where: {
        status: "COMPLETED",
      },
    });

    const recentRecords =
      await prisma.parkingRecord.findMany({
        include: {
          vehicle: true,
          parkingSlot: true,
        },
        orderBy: {
          checkInTime: "desc",
        },
        take: 5,
      });

    // Monthly Revenue
    const monthlyRaw =
      await prisma.parkingRecord.findMany({
        where: {
          status: "COMPLETED",
          checkOutTime: {
            not: null,
          },
        },
        select: {
          amountCharged: true,
          checkOutTime: true,
        },
      });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthlyRevenue = monthNames.map(
      (month) => ({
        month,
        revenue: 0,
      })
    );

    monthlyRaw.forEach((record) => {
      if (!record.checkOutTime) return;

      const month =
        new Date(record.checkOutTime).getMonth();

      monthlyRevenue[month].revenue += Number(
        record.amountCharged ?? 0
      );
    });

    return NextResponse.json({
      totalVehicles,
      totalSlots,
      availableSlots,
      occupiedSlots,
      activeParking,
      completedParking,
      revenue:
        Number(revenue._sum.amountCharged) || 0,
      recentRecords,
      monthlyRevenue,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Dashboard failed",
      },
      {
        status: 500,
      }
    );
  }
}