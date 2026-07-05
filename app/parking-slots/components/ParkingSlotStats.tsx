"use client";

import { ParkingSlot } from "@/types/parking-slot";
import {
  ParkingSquare,
  CheckCircle2,
  Car,
  Wrench,
} from "lucide-react";

interface ParkingSlotStatsProps {
  slots: ParkingSlot[];
}

export default function ParkingSlotStats({
  slots,
}: ParkingSlotStatsProps) {
  const total = slots.length;

  const available = slots.filter(
    (slot) => slot.status === "AVAILABLE"
  ).length;

  const occupied = slots.filter(
    (slot) => slot.status === "OCCUPIED"
  ).length;

  const maintenance = slots.filter(
    (slot) => slot.condition === "MAINTENANCE"
  ).length;

  const cards = [
    {
      title: "Total Slots",
      value: total,
      icon: ParkingSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Available",
      value: available,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Occupied",
      value: occupied,
      icon: Car,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      title: "Maintenance",
      value: maintenance,
      icon: Wrench,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">
                {card.title}
              </p>

              <h2 className="text-3xl font-bold mt-1">
                {card.value}
              </h2>
            </div>

            <div
              className={`${card.bg} p-3 rounded-full`}
            >
              <Icon
                className={`${card.color} w-7 h-7`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}