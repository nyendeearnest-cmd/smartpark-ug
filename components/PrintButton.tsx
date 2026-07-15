"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
    >
      🖨️ Print Receipt
    </button>
  );
}