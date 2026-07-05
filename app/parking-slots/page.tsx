"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ParkingSlotStats from "./components/ParkingSlotStats";
import ParkingSlotFilters from "./components/ParkingSlotFilters";
import ParkingSlotGrid from "./components/ParkingSlotGrid";
import ParkingSlotForm from "./components/ParkingSlotForm";
import { ParkingSlot } from "@/types/parking-slot";
import { toast } from "sonner";

export default function ParkingSlotsPage() {
  const [slots, setSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const [open, setOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<ParkingSlot | null>(null);

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    try {
      setLoading(true);

      const res = await fetch("/api/parking-slots");

      if (!res.ok) {
        throw new Error("Failed to fetch parking slots.");
      }

      const data = await res.json();
      setSlots(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load parking slots.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this parking slot?")) return;

    try {
      const res = await fetch(`/api/parking-slots/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Delete failed.");
        return;
      }

      toast.success("Parking slot deleted.");
      fetchSlots();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  }

  function handleEdit(slot: ParkingSlot) {
    setEditingSlot(slot);
    setOpen(true);
  }

  const filteredSlots = slots.filter((slot) => {
    const matchesSearch = slot.slotNumber
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesZone =
      zone === "ALL" || slot.zone === zone;

    const matchesStatus =
      status === "ALL" || slot.status === status;

    return matchesSearch && matchesZone && matchesStatus;
  });

  return (
    <DashboardLayout
      title="Parking Slots"
      description="Manage parking spaces"
    >
      <ParkingSlotStats slots={slots} />

      <ParkingSlotFilters
        search={search}
        onSearchChange={setSearch}
        zone={zone}
        onZoneChange={setZone}
        status={status}
        onStatusChange={setStatus}
      />

      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditingSlot(null);
            setOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Slot
        </button>
      </div>

      <ParkingSlotForm
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchSlots}
        editingSlot={editingSlot}
      />

      {loading && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Loading parking slots...
          </p>
        </div>
      )}

      {!loading && filteredSlots.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No parking slots found.
          </p>
        </div>
      )}

      {!loading && filteredSlots.length > 0 && (
        <ParkingSlotGrid
          slots={filteredSlots}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </DashboardLayout>
  );
}