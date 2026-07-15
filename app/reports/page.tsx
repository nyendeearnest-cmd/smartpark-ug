"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { exportParkingReport } from "@/app/lib/exportPdf";
import {
  DollarSign,
  ClipboardCheck,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

type ReportRecord = {
  id: string;
  amountCharged: number | null;
  durationMinutes: number | null;
  checkInTime: string;
  checkOutTime: string | null;

  vehicle: {
    numberPlate: string;
  };

  parkingSlot: {
    slotNumber: string;
  };
};

type ReportData = {
  totalRevenue: number;
  totalCompleted: number;
  records: ReportRecord[];
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const res = await fetch("/api/reports");

      if (!res.ok) {
        throw new Error("Failed to load reports");
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredRecords = useMemo(() => {
    if (!data) return [];

    return data.records.filter((record) => {
      const plate = record.vehicle.numberPlate.toLowerCase();
      const slot = record.parkingSlot.slotNumber.toLowerCase();
      const q = search.toLowerCase();

      return (
        plate.includes(q) ||
        slot.includes(q)
      );
    });
  }, [data, search]);

  return (
    <DashboardLayout
      title="Reports"
      description="Revenue and completed parking sessions"
    >
      {loading ? (
        <p className="text-gray-500">
          Loading reports...
        </p>
      ) : !data ? (
        <p className="text-red-500">
          Failed to load reports.
        </p>
      ) : (
        <>
          {/* Summary */}
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <div className="bg-white rounded-xl border shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  UGX {data.totalRevenue.toLocaleString()}
                </h2>
              </div>

              <div className="bg-green-600 text-white p-4 rounded-xl">
                <DollarSign size={28} />
              </div>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-5 flex justify-between items-center">
              <div>
                <p className="text-gray-500">
                  Completed Sessions
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {data.totalCompleted}
                </h2>
              </div>

              <div className="bg-blue-600 text-white p-4 rounded-xl">
                <ClipboardCheck size={28} />
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="bg-white rounded-xl border shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-4 justify-between">
            <input
              type="text"
              placeholder="Search by plate or slot..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border rounded-lg p-3 flex-1"
            />

            <div className="flex gap-3">

              <a
                href="/api/reports/excel"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
              >
                <FileSpreadsheet size={20} />
                Excel
              </a>

              <button
                onClick={() =>
                  exportParkingReport(
                    filteredRecords,
                    data.totalRevenue
                  )
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
              >
                <FileText size={20} />
                PDF
              </button>

            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-4">Vehicle</th>
                  <th className="text-left p-4">Slot</th>
                  <th className="text-left p-4">Check In</th>
                  <th className="text-left p-4">Check Out</th>
                  <th className="text-left p-4">Duration</th>
                  <th className="text-left p-4">Amount</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-6 text-center text-gray-500"
                    >
                      No completed records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t"
                    >
                      <td className="p-4">
                        {record.vehicle.numberPlate}
                      </td>

                      <td className="p-4">
                        {record.parkingSlot.slotNumber}
                      </td>

                      <td className="p-4">
                        {new Date(
                          record.checkInTime
                        ).toLocaleString()}
                      </td>

                      <td className="p-4">
                        {record.checkOutTime
                          ? new Date(
                              record.checkOutTime
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="p-4">
                        {record.durationMinutes ?? 0} min
                      </td>

                      <td className="p-4 font-semibold text-green-700">
                        UGX{" "}
                        {Number(
                          record.amountCharged ?? 0
                        ).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}