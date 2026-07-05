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

type ParkingRecord = {
  id: string;
  checkInTime: string;
  checkOutTime: string | null;
  durationMinutes: number | null;
  amountCharged: number | null;
  status: "ACTIVE" | "COMPLETED";

  vehicle: Vehicle;

  parkingSlot: {
    id: string;
    slotNumber: string;
  };
};

export default function ParkingRecordsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [records, setRecords] = useState<ParkingRecord[]>([]);
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

      const vehiclesData = await vRes.json();
      const slotsData = await sRes.json();
      const recordsData = await rRes.json();

      setVehicles(vehiclesData);

      setSlots(
        slotsData.filter(
          (slot: Slot) => slot.status === "AVAILABLE"
        )
      );

      setRecords(recordsData);
    } catch {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckIn(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

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
        toast.error(data.message);
        return;
      }

      toast.success("Vehicle checked in.");

      setForm({
        vehicleId: "",
        parkingSlotId: "",
      });

      fetchData();
    } catch {
      toast.error("Check-in failed.");
    }
  }

  async function handleCheckout(id: string) {
    if (!confirm("Check out this vehicle?")) return;

    try {
      const res = await fetch(
        `/api/parking-records/${id}/checkout`,
        {
          method: "PUT",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("Vehicle checked out.");

      fetchData();
    } catch {
      toast.error("Checkout failed.");
    }
  }

  return (
    <DashboardLayout
      title="Parking Records"
      description="Manage vehicle check-in and check-out"
    >
      <form
        onSubmit={handleCheckIn}
        className="bg-white border rounded-xl p-5 mb-6 grid md:grid-cols-3 gap-4"
      >
        <select
          className="border rounded-lg p-3"
          value={form.vehicleId}
          onChange={(e) =>
            setForm({
              ...form,
              vehicleId: e.target.value,
            })
          }
        >
          <option value="">Select Vehicle</option>

          {vehicles.map((vehicle) => (
            <option
              key={vehicle.id}
              value={vehicle.id}
            >
              {vehicle.numberPlate}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg p-3"
          value={form.parkingSlotId}
          onChange={(e) =>
            setForm({
              ...form,
              parkingSlotId: e.target.value,
            })
          }
        >
          <option value="">Select Slot</option>

          {slots.map((slot) => (
            <option
              key={slot.id}
              value={slot.id}
            >
              {slot.slotNumber}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg"
        >
          Check In Vehicle
        </button>
      </form>

      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left p-4">Vehicle</th>
              <th className="text-left p-4">Slot</th>
              <th className="text-left p-4">Check In</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4">Duration</th>
              <th className="text-left p-4">Amount</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : (
              records.map((record) => (
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
                    {record.status}
                  </td>

                  <td className="p-4">
                    {record.durationMinutes
                      ? `${record.durationMinutes} min`
                      : "-"}
                  </td>

                  <td className="p-4">
                    {record.amountCharged
                      ? `UGX ${record.amountCharged}`
                      : "-"}
                  </td>

                  <td className="p-4">
                    {record.status === "ACTIVE" ? (
                      <button
                        onClick={() =>
                          handleCheckout(record.id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Check Out
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}