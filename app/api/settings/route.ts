import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    let settings = await prisma.systemSetting.findFirst();

    if (!settings) {
      settings = await prisma.systemSetting.create({
        data: {
          companyName: "SmartPark UG",
          phone: "",
          email: "",
          address: "",
          logo: "",
          pricePerHour: 1000,
          gracePeriod: 15,
        },
      });
    }

    return NextResponse.json(settings);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to load settings.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(req: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await req.json();

    const existing = await prisma.systemSetting.findFirst();

    if (!existing) {
      const created = await prisma.systemSetting.create({
        data: body,
      });

      return NextResponse.json(created);
    }

    const updated = await prisma.systemSetting.update({
      where: {
        id: existing.id,
      },
      data: body,
    });

    return NextResponse.json(updated);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Failed to update settings.",
      },
      {
        status: 500,
      }
    );
  }
}