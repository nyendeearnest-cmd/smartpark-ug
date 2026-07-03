"use client";

import { useEffect, useState } from "react";
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

  // Fill the form when Edit is clicked
  useEffect(() => {
    if (editingVehicleType) {
      setName(editingVehicleType.name);
      setFirstHourRate(editingVehicleType.firstHourRate);
      setAdditionalHourRate(editingVehicleType.additionalHourRate);
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
        // UPDATE
        response = await fetch(
          `/api/vehicle-types/${editingVehicleType.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name,
              firstHourRate: Number(firstHourRate),
              additionalHourRate: Number(additionalHourRate),
            }),
          }
        );
      } else {
        // CREATE
        response = await fetch("/api/vehicle-types", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            firstHourRate: Number(firstHourRate),
            additionalHourRate: Number(additionalHourRate),
          }),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Operation failed.");
        return;
      }

      clearForm();
      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="border rounded-lg p-6 mb-6 shadow">
      <h2 className="text-xl font-semibold mb-4">
        {editingVehicleType
          ? "Update Vehicle Type"
          : "Add Vehicle Type"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Vehicle Type Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="number"
          placeholder="First Hour Rate"
          value={firstHourRate}
          onChange={(e) => setFirstHourRate(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <input
          type="number"
          placeholder="Additional Hour Rate"
          value={additionalHourRate}
          onChange={(e) => setAdditionalHourRate(e.target.value)}
          className="w-full border rounded p-2"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingVehicleType
              ? "Update Vehicle Type"
              : "Save Vehicle Type"}
          </button>

          {editingVehicleType && (
            <button
              type="button"
              onClick={() => {
                clearForm();
                onCancel();
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}