import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const slots = await prisma.parkingSlot.findMany({
      orderBy: {
        slotNumber: "asc",
      },
    });

    return NextResponse.json(slots);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch parking slots" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const slotNumber = body.slotNumber;
    const zone = body.zone;
    const status = body.status;
    const condition = body.condition;

    if (!slotNumber || !zone) {
      return NextResponse.json(
        { message: "Slot number and zone are required" },
        { status: 400 }
      );
    }

    const slot = await prisma.parkingSlot.create({
      data: {
        slotNumber,
        zone,
        status: status || "AVAILABLE",
        condition: condition || "ACTIVE",
      },
    });

    return NextResponse.json(slot, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create parking slot" },
      { status: 500 }
    );
  }
}