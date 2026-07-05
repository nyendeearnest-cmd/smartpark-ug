"use client";

import { ParkingSlot } from "@/types/parking-slot";
import { Pencil, Trash2, MapPin } from "lucide-react";

interface ParkingSlotCardProps {
  slot: ParkingSlot;
  onEdit: (slot: ParkingSlot) => void;
  onDelete: (id: string) => void;
}

export default function ParkingSlotCard({
  slot,
  onEdit,
  onDelete,
}: ParkingSlotCardProps) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">
            Slot {slot.slotNumber}
          </h2>

          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <MapPin size={14} />
            Zone {slot.zone}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            slot.status === "AVAILABLE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {slot.status}
        </span>

        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700">
          {slot.condition}
        </span>
      </div>

      <div className="flex gap-2 mt-5 justify-end">
        <button
          onClick={() => onEdit(slot)}
          className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(slot.id)}
          className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}