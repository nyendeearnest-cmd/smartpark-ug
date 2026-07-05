"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

type Vehicle = {
  id: string;
  numberPlate: string;
};

type Slot = {
  id: string;
  slotNumber: string;
  status: string;
};

type Record = {
  id: string;
  vehicle: Vehicle;
  parkingSlot: Slot;
  checkInTime: string;
};

export default function ParkingRecordsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
  vehicleId: "",
  parkingSlotId: "",
});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);

      const [vRes, sRes, rRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/parking-slots"),
        fetch("/api/parking-records"),
      ]);

      setVehicles(await vRes.json());

      const allSlots = await sRes.json();
      setSlots(allSlots.filter((s: Slot) => s.status === "AVAILABLE"));

      setRecords(await rRes.json());
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(e: React.FormEvent) {
    e.preventDefault();

    if (!form.vehicleId || !form.parkingSlotId) {
      toast.error("Select vehicle and slot");
      return;
    }

    try {
      const res = await fetch("/api/parking-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Check-in failed");
        return;
      }

      toast.success("Vehicle checked in");

     setForm({
  vehicleId: "",
  parkingSlotId: "",
});
      fetchData();
    } catch {
      toast.error("Check-in failed");
    }
  }

  return (
    <DashboardLayout
      title="Check-In"
      description="Manage vehicle entry"
    >
      {/* FORM */}
      <form
        onSubmit={handleCheckIn}
        className="bg-white border p-4 rounded-xl grid md:grid-cols-4 gap-3 mb-6"
      >
        {/* VEHICLE */}
        <select
          value={form.vehicleId}
          onChange={(e) =>
            setForm({ ...form, vehicleId: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.numberPlate}
            </option>
          ))}
        </select>

        {/* SLOT */}
        <select
          value={form.parkingSlotId}
          onChange={(e) =>
            setForm({ ...form, parkingSlotId: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Slot</option>
          {slots.map((s) => (
            <option key={s.id} value={s.id}>
              {s.slotNumber}
            </option>
          ))}
        </select>

        {/* BUTTON (IMPORTANT FIX) */}
        <button
          type="submit"
          className="bg-green-600 text-white rounded px-4 py-2 md:col-span-2"
        >
          Check In Vehicle
        </button>
      </form>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* TABLE */}
      {!loading && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Slot</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3">{r.vehicle.numberPlate}</td>
                  <td className="p-3">{r.parkingSlot.slotNumber}</td>
                  <td className="p-3">
                    {new Date(r.checkInTime).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}