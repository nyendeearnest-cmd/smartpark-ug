import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import ExcelJS from "exceljs";

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

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Parking Report");

    worksheet.columns = [
      { header: "Vehicle", key: "vehicle", width: 20 },
      { header: "Slot", key: "slot", width: 15 },
      { header: "Check In", key: "checkIn", width: 25 },
      { header: "Check Out", key: "checkOut", width: 25 },
      { header: "Duration (Min)", key: "duration", width: 18 },
      { header: "Amount (UGX)", key: "amount", width: 18 },
      { header: "Status", key: "status", width: 15 },
    ];

    worksheet.getRow(1).font = {
      bold: true,
    };

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: {
        argb: "2563EB",
      },
    };

    worksheet.getRow(1).font = {
      color: {
        argb: "FFFFFF",
      },
      bold: true,
    };

    records.forEach((record) => {
      worksheet.addRow({
        vehicle: record.vehicle.numberPlate,
        slot: record.parkingSlot.slotNumber,
        checkIn: record.checkInTime.toLocaleString(),
        checkOut: record.checkOutTime
          ? record.checkOutTime.toLocaleString()
          : "-",
        duration: record.durationMinutes ?? "-",
        amount: record.amountCharged ?? 0,
        status: record.status,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as ArrayBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=Parking_Report_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to export Excel report.",
      },
      {
        status: 500,
      }
    );
  }
}