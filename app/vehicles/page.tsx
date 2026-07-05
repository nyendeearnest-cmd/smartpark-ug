"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

type VehicleType = {
  id: string;
  name: string;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    numberPlate: "",
    driverName: "",
    driverPhone: "",
    vehicleTypeId: "",
  });

  useEffect(() => {
    fetchVehicles();
    fetchVehicleTypes();
  }, []);

  async function fetchVehicles() {
    try {
      const res = await fetch("/api/vehicles");
      const data = await res.json();
      setVehicles(data);
    } catch {
      toast.error("Failed to load vehicles");
    } finally {
      setLoading(false);
    }
  }

  async function fetchVehicleTypes() {
    const res = await fetch("/api/vehicle-types");
    const data = await res.json();
    setVehicleTypes(data);
  }

  function resetForm() {
    setForm({
      numberPlate: "",
      driverName: "",
      driverPhone: "",
      vehicleTypeId: "",
    });
    setEditingId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const url = editingId
        ? `/api/vehicles/${editingId}`
        : "/api/vehicles";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success(
        editingId
          ? "Vehicle updated"
          : "Vehicle created"
      );

      resetForm();
      fetchVehicles();
    } catch {
      toast.error("Something went wrong");
    }
  }

  function handleEdit(vehicle: Vehicle) {
    setEditingId(vehicle.id);

    setForm({
      numberPlate: vehicle.numberPlate,
      driverName: vehicle.driverName,
      driverPhone: vehicle.driverPhone,
      vehicleTypeId: vehicle.vehicleTypeId,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete vehicle?")) return;

    const res = await fetch(`/api/vehicles/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }

    toast.success("Vehicle deleted");
    fetchVehicles();
  }

  return (
    <DashboardLayout
      title="Vehicles"
      description="Manage registered vehicles"
    >
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl border mb-6 grid grid-cols-1 md:grid-cols-5 gap-3"
      >
        <input
          placeholder="Number Plate"
          value={form.numberPlate}
          onChange={(e) =>
            setForm({ ...form, numberPlate: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Driver Name"
          value={form.driverName}
          onChange={(e) =>
            setForm({ ...form, driverName: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          placeholder="Driver Phone"
          value={form.driverPhone}
          onChange={(e) =>
            setForm({ ...form, driverPhone: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* DROPDOWN */}
        <select
          value={form.vehicleTypeId}
          onChange={(e) =>
            setForm({ ...form, vehicleTypeId: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Select Type</option>
          {vehicleTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <button className="bg-blue-600 text-white rounded px-4 py-2">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* TABLE */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Plate</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Type</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id} className="border-t">
                  <td className="p-3">{v.numberPlate}</td>
                  <td className="p-3">{v.driverName}</td>
                  <td className="p-3">{v.driverPhone}</td>
                  <td className="p-3">
                    {v.vehicleType?.name}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(v)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* RESET BUTTON */}
      {editingId && (
        <div className="mt-4">
          <button
            onClick={resetForm}
            className="text-sm text-gray-500 underline"
          >
            Cancel edit
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}