"use client";

import { ParkingSlot } from "@/types/parking-slot";
import ParkingSlotCard from "./ParkingSlotCard";

interface ParkingSlotGridProps {
  slots: ParkingSlot[];
  onEdit: (slot: ParkingSlot) => void;
  onDelete: (id: string) => void;
}

export default function ParkingSlotGrid({
  slots,
  onEdit,
  onDelete,
}: ParkingSlotGridProps) {
  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
        No parking slots found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {slots.map((slot) => (
        <ParkingSlotCard
          key={slot.id}
          slot={slot}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}