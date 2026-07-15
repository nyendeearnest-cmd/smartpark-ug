"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatsCard from "./components/StatsCard";
import OccupancyChart from "./components/OccupancyChart";
import RevenueChart from "./components/RevenueChart";
import {
  Car,
  ParkingSquare,
  CircleParking,
  DollarSign,
} from "lucide-react";

type DashboardData = {
  totalVehicles: number;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  activeParking: number;
  completedParking: number;
  revenue: number;

  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];

  recentRecords: {
    id: string;
    checkInTime: string;
    status: string;
    vehicle: {
      numberPlate: string;
    };
    parkingSlot: {
      slotNumber: string;
    };
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const res = await fetch("/api/dashboard");

      if (!res.ok) {
        throw new Error("Failed to load dashboard");
      }

      const json = await res.json();

      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="SmartPark UG Overview"
      >
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout
        title="Dashboard"
        description="SmartPark UG Overview"
      >
        <p className="text-red-500">
          Failed to load dashboard.
        </p>
      </DashboardLayout>
    );
  }

  const occupancy =
    data.totalSlots === 0
      ? 0
      : Math.round(
          (data.occupiedSlots /
            data.totalSlots) *
            100
        );

  return (
    <DashboardLayout
      title="Dashboard"
      description="SmartPark UG Overview"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Vehicles"
          value={data.totalVehicles}
          icon={Car}
          color="bg-blue-600"
        />

        <StatsCard
          title="Available Slots"
          value={data.availableSlots}
          icon={ParkingSquare}
          color="bg-green-600"
        />

        <StatsCard
          title="Active Parking"
          value={data.activeParking}
          icon={CircleParking}
          color="bg-orange-600"
        />

        <StatsCard
          title="Revenue"
          value={`UGX ${data.revenue.toLocaleString()}`}
          icon={DollarSign}
          color="bg-purple-600"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <OccupancyChart
          available={data.availableSlots}
          occupied={data.occupiedSlots}
        />

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">
            Occupancy Rate
          </h2>

          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-blue-600 h-full"
              style={{
                width: `${occupancy}%`,
              }}
            />
          </div>

          <p className="mt-4 text-3xl font-bold">
            {occupancy}%
          </p>

          <p className="text-gray-500 mt-2">
            {data.occupiedSlots} occupied of{" "}
            {data.totalSlots} slots
          </p>
        </div>
      </div>

      {/* NEW MONTHLY REVENUE CHART */}
      <div className="mb-6">
        <RevenueChart
          data={data.monthlyRevenue}
        />
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">
            Recent Parking Activity
          </h2>
        </div>

        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">
                Vehicle
              </th>
              <th className="text-left p-4">
                Slot
              </th>
              <th className="text-left p-4">
                Time
              </th>
              <th className="text-left p-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {data.recentRecords.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-gray-500"
                >
                  No parking activity yet.
                </td>
              </tr>
            ) : (
              data.recentRecords.map(
                (record) => (
                  <tr
                    key={record.id}
                    className="border-t"
                  >
                    <td className="p-4">
                      {
                        record.vehicle
                          .numberPlate
                      }
                    </td>

                    <td className="p-4">
                      {
                        record.parkingSlot
                          .slotNumber
                      }
                    </td>

                    <td className="p-4">
                      {new Date(
                        record.checkInTime
                      ).toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          record.status ===
                          "ACTIVE"
                            ? "bg-green-600"
                            : "bg-gray-600"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}