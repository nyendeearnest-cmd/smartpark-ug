"use client";

import { useEffect, useState } from "react";
import VehicleTypeForm from "./components/VehicleTypeForm";
import VehicleTypeTable from "./components/VehicleTypeTable";
import { VehicleType } from "../types/vehicle-type";

export default function VehicleTypesPage() {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [editingVehicleType, setEditingVehicleType] =
    useState<VehicleType | null>(null);

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
      console.error("Error fetching vehicle types:", error);
    }
  }

  function handleEdit(vehicleType: VehicleType) {
    setEditingVehicleType(vehicleType);
  }

  function handleSuccess() {
    fetchVehicleTypes();
    setEditingVehicleType(null);
  }

  function handleCancelEdit() {
    setEditingVehicleType(null);
  }

  function handleDelete() {
    fetchVehicleTypes();
    setEditingVehicleType(null);
  }

  return (
    <main className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Vehicle Types
      </h1>

      <VehicleTypeForm
        onSuccess={handleSuccess}
        editingVehicleType={editingVehicleType}
        onCancel={handleCancelEdit}
      />

      <VehicleTypeTable
        vehicleTypes={vehicleTypes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </main>
  );
}