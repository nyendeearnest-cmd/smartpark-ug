"use client";

interface ParkingSlotFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  zone: string;
  onZoneChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;
}

export default function ParkingSlotFilters({
  search,
  onSearchChange,
  zone,
  onZoneChange,
  status,
  onStatusChange,
}: ParkingSlotFiltersProps) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by slot number..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        />

        {/* Zone */}
        <select
          value={zone}
          onChange={(e) => onZoneChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All Zones</option>
          <option value="A">Zone A</option>
          <option value="B">Zone B</option>
          <option value="C">Zone C</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All Status</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
        </select>
      </div>
    </div>
  );
}