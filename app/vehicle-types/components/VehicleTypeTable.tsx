"use client";

import { VehicleType } from "../../types/vehicle-type";

interface VehicleTypeTableProps {
  vehicleTypes: VehicleType[];
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: () => void;
}

export default function VehicleTypeTable({
  vehicleTypes,
  onEdit,
  onDelete,
}: VehicleTypeTableProps) {
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this vehicle type?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/vehicle-types/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      onDelete();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <table className="w-full border border-gray-300 mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Name</th>
          <th className="border p-2">First Hour (UGX)</th>
          <th className="border p-2">Additional Hour (UGX)</th>
          <th className="border p-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {vehicleTypes.map((vehicleType) => (
          <tr key={vehicleType.id}>
            <td className="border p-2">{vehicleType.name}</td>

            <td className="border p-2">
              {vehicleType.firstHourRate}
            </td>

            <td className="border p-2">
              {vehicleType.additionalHourRate}
            </td>

            <td className="border p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(vehicleType)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(vehicleType.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}