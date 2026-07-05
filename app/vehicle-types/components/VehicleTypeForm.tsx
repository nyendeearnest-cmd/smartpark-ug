"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { VehicleType } from "../../types/vehicle-type";

interface VehicleTypeFormProps {
  onSuccess: () => void;
  editingVehicleType: VehicleType | null;
  onCancel: () => void;
}

export default function VehicleTypeForm({
  onSuccess,
  editingVehicleType,
  onCancel,
}: VehicleTypeFormProps) {
  const [name, setName] = useState("");
  const [firstHourRate, setFirstHourRate] = useState("");
  const [additionalHourRate, setAdditionalHourRate] = useState("");

  useEffect(() => {
    if (editingVehicleType) {
      setName(editingVehicleType.name);
      setFirstHourRate(String(editingVehicleType.firstHourRate));
      setAdditionalHourRate(String(editingVehicleType.additionalHourRate));
    } else {
      clearForm();
    }
  }, [editingVehicleType]);

  function clearForm() {
    setName("");
    setFirstHourRate("");
    setAdditionalHourRate("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      let response: Response;

      if (editingVehicleType) {
        response = await fetch(
          `/api/vehicle-types/${editingVehicleType.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              firstHourRate: Number(firstHourRate),
              additionalHourRate: Number(additionalHourRate),
            }),
          }
        );
      } else {
        response = await fetch("/api/vehicle-types", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            firstHourRate: Number(firstHourRate),
            additionalHourRate: Number(additionalHourRate),
          }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Operation failed");
        return;
      }

      toast.success(
        editingVehicleType
          ? "Vehicle type updated"
          : "Vehicle type created"
      );

      clearForm();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="border rounded-lg p-6 mb-6 shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">
        {editingVehicleType
          ? "Update Vehicle Type"
          : "Add Vehicle Type"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Vehicle Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="First Hour Rate"
          value={firstHourRate}
          onChange={(e) => setFirstHourRate(e.target.value)}
        />

        <input
          className="w-full border p-2 rounded"
          type="number"
          placeholder="Additional Hour Rate"
          value={additionalHourRate}
          onChange={(e) => setAdditionalHourRate(e.target.value)}
        />

        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            {editingVehicleType ? "Update" : "Save"}
          </button>

          {editingVehicleType && (
            <button
              type="button"
              onClick={() => {
                clearForm();
                onCancel();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}