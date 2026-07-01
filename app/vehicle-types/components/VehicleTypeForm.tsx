"use client";

import { useState } from "react";

interface VehicleTypeFormProps {
  onSuccess: () => void;
}

export default function VehicleTypeForm({
  onSuccess,
}: VehicleTypeFormProps) {
  const [name, setName] = useState("");
  const [firstHourRate, setFirstHourRate] = useState("");
  const [additionalHourRate, setAdditionalHourRate] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/vehicle-types", {
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

      if (!response.ok) {
        const error = await response.json();
        alert(error.message || "Failed to save vehicle type.");
        return;
      }

      // Clear the form
      setName("");
      setFirstHourRate("");
      setAdditionalHourRate("");

      // Refresh the table
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="border rounded-lg p-6 mb-6 shadow">
      <h2 className="text-xl font-semibold mb-4">
        Add Vehicle Type
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Vehicle Type
        </button>
      </form>
    </div>
  );
}