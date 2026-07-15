import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
    notFound();
  }

  const settings = await prisma.systemSetting.findFirst();

  return (
    <main className="max-w-2xl mx-auto bg-white min-h-screen p-10">
      <div className="border rounded-xl p-8 shadow">

        <h1 className="text-3xl font-bold text-center">
          {settings?.companyName ?? "SmartPark UG"}
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Parking Receipt
        </p>

        <hr className="mb-6" />

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Receipt ID</span>
            <strong>{record.id}</strong>
          </div>

          <div className="flex justify-between">
            <span>Vehicle</span>
            <strong>{record.vehicle.numberPlate}</strong>
          </div>

          <div className="flex justify-between">
            <span>Vehicle Type</span>
            <strong>{record.vehicle.vehicleType.name}</strong>
          </div>

          <div className="flex justify-between">
            <span>Parking Slot</span>
            <strong>{record.parkingSlot.slotNumber}</strong>
          </div>

          <div className="flex justify-between">
            <span>Check In</span>
            <strong>
              {new Date(
                record.checkInTime
              ).toLocaleString()}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Check Out</span>
            <strong>
              {record.checkOutTime
                ? new Date(
                    record.checkOutTime
                  ).toLocaleString()
                : "-"}
            </strong>
          </div>

          <div className="flex justify-between">
            <span>Duration</span>
            <strong>
              {record.durationMinutes} Minutes
            </strong>
          </div>

          <hr />

          <div className="flex justify-between text-2xl font-bold">
            <span>Total Paid</span>
            <span>
              UGX {record.amountCharged}
            </span>
          </div>

        </div>

        <PrintButton />

      </div>
    </main>
  );
}