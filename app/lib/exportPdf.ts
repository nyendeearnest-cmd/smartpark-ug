import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type Record = {
  vehicle: {
    numberPlate: string;
  };
  parkingSlot: {
    slotNumber: string;
  };
  checkInTime: string;
  checkOutTime: string | null;
  durationMinutes: number | null;
  amountCharged: number | null;
};

export function exportParkingReport(
  records: Record[],
  totalRevenue: number
) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(20);
  doc.text("SmartPark UG", 14, 18);

  doc.setFontSize(13);
  doc.text("Parking Revenue Report", 14, 28);

  doc.setFontSize(10);
  doc.text(
    `Generated: ${new Date().toLocaleString()}`,
    14,
    36
  );

  autoTable(doc, {
    startY: 45,

    head: [
      [
        "Vehicle",
        "Slot",
        "Check In",
        "Check Out",
        "Duration",
        "Amount",
      ],
    ],

    body: records.map((record) => [
      record.vehicle.numberPlate,
      record.parkingSlot.slotNumber,
      new Date(record.checkInTime).toLocaleString(),
      record.checkOutTime
        ? new Date(record.checkOutTime).toLocaleString()
        : "-",
      `${record.durationMinutes ?? 0} min`,
      `UGX ${Number(
        record.amountCharged ?? 0
      ).toLocaleString()}`,
    ]),
  });

  const finalY =
    (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);

  doc.text(
    `Total Revenue: UGX ${totalRevenue.toLocaleString()}`,
    14,
    finalY
  );

  doc.save("SmartPark_Report.pdf");
}