"use client";

import { useEffect, useState } from "react";
import { ParkingSlot } from "@/types/parking-slot";
import { toast } from "sonner";

interface ParkingSlotFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingSlot: ParkingSlot | null;
}

export default function ParkingSlotForm({
  open,
  onClose,
  onSuccess,
  editingSlot,
}: ParkingSlotFormProps) {
  const [slotNumber, setSlotNumber] = useState("");
  const [zone, setZone] = useState("A");
  const [status, setStatus] = useState("AVAILABLE");
  const [condition, setCondition] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingSlot) {
      setSlotNumber(editingSlot.slotNumber);
      setZone(editingSlot.zone);
      setStatus(editingSlot.status);
      setCondition(editingSlot.condition);
    } else {
      clearForm();
    }
  }, [editingSlot, open]);

  function clearForm() {
    setSlotNumber("");
    setZone("A");
    setStatus("AVAILABLE");
    setCondition("ACTIVE");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    try {
      const url = editingSlot
        ? `/api/parking-slots/${editingSlot.id}`
        : "/api/parking-slots";

      const method = editingSlot ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slotNumber,
          zone,
          status,
          condition,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(
        editingSlot
          ? "Parking slot updated."
          : "Parking slot created."
      );

      clearForm();
      onSuccess();
      onClose();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-5">
          {editingSlot ? "Edit Parking Slot" : "New Parking Slot"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Slot Number"
            value={slotNumber}
            onChange={(e) => setSlotNumber(e.target.value)}
            className="w-full border rounded-lg p-3"
            required
          />

          <select
            value={zone}
            onChange={(e) => setZone(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="A">Zone A</option>
            <option value="B">Zone B</option>
            <option value="C">Zone C</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="OCCUPIED">OCCUPIED</option>
          </select>

          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="RESERVED">RESERVED</option>
            <option value="MAINTENANCE">MAINTENANCE</option>
          </select>

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
            >
              {loading
                ? "Saving..."
                : editingSlot
                ? "Update"
                : "Create"}
            </button>

          </div>
        </form>

      </div>
    </div>
  );
}