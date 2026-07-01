"use client";

import { useEffect, useState } from "react";
import VehicleTypeForm from "./components/VehicleTypeForm";
import VehicleTypeTable from "./components/VehicleTypeTable";

type VehicleType = {
  id: string;
  name: string;
  firstHourRate: string;
  additionalHourRate: string;
};

export default function VehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);

  useEffect(() => {
    fetchVehicleTypes();
  }, []);

  async function fetchVehicleTypes() {
    try {
      const response = await fetch("/api/vehicle-types");

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle types.");
      }

      const data = await response.json();
      setVehicleTypes(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Vehicle Types
      </h1>

      <VehicleTypeForm onSuccess={fetchVehicleTypes} />

      <VehicleTypeTable vehicleTypes={vehicleTypes} />
    </main>
  );
}