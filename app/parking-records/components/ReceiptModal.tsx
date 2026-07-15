"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ReceiptProps = {
  open: boolean;
  onClose: () => void;
  receipt: any;
};

export default function ReceiptModal({
  open,
  onClose,
  receipt,
}: ReceiptProps) {
  if (!open || !receipt) return null;

  const receiptNumber = `RC-${receipt.id.slice(-6).toUpperCase()}`;

  const amount = Number(receipt.amountCharged || 0);

  async function downloadPDF() {
    const element = document.getElementById("receipt");

    if (!element) return;

    const canvas = await html2canvas(element);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const width = 190;

    const height =
      (canvas.height * width) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      10,
      10,
      width,
      height
    );

    pdf.save(`${receiptNumber}.pdf`);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-md">

        <div id="receipt">

          <div className="bg-blue-700 text-white text-center p-6">
            <h1 className="text-2xl font-bold">
              SmartPark UG
            </h1>

            <p>Parking Receipt</p>
          </div>

          <div className="p-6 space-y-3">

            <div className="flex justify-between">
              <span>Receipt</span>
              <span>{receiptNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>Date</span>
              <span>
                {new Date().toLocaleString()}
              </span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>Vehicle</span>
              <span>
                {receipt.vehicle.numberPlate}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Slot</span>
              <span>
                {receipt.parkingSlot.slotNumber}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Check In</span>
              <span>
                {new Date(
                  receipt.checkInTime
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Check Out</span>
              <span>
                {new Date(
                  receipt.checkOutTime
                ).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Duration</span>
              <span>
                {receipt.durationMinutes} mins
              </span>
            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold text-green-700">
              <span>Total</span>

              <span>
                UGX {amount.toLocaleString()}
              </span>
            </div>

            <div className="text-center pt-5 text-gray-500">
              Thank you for choosing SmartPark UG
            </div>

          </div>

        </div>

        <div className="grid grid-cols-3 gap-2 p-5 bg-gray-100">

          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white rounded-lg py-2"
          >
            Print
          </button>

          <button
            onClick={downloadPDF}
            className="bg-blue-600 text-white rounded-lg py-2"
          >
            PDF
          </button>

          <button
            onClick={onClose}
            className="bg-gray-500 text-white rounded-lg py-2"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}