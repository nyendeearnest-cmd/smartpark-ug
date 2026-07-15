"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

type Props = {
  available: number;
  occupied: number;
};

export default function OccupancyChart({
  available,
  occupied,
}: Props) {
  const data = [
    {
      name: "Available",
      value: available,
    },
    {
      name: "Occupied",
      value: occupied,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5">
      <h2 className="text-lg font-semibold mb-4">
        Parking Occupancy
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}