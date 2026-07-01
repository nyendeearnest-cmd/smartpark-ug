type VehicleType = {
  id: string;
  name: string;
  firstHourRate: string;
  additionalHourRate: string;
};

interface VehicleTypeTableProps {
  vehicleTypes: VehicleType[];
}

export default function VehicleTypeTable({
  vehicleTypes,
}: VehicleTypeTableProps) {
  return (
    <table className="w-full border border-gray-300 mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">Name</th>
          <th className="border p-2">First Hour (UGX)</th>
          <th className="border p-2">Additional Hour (UGX)</th>
        </tr>
      </thead>

      <tbody>
        {vehicleTypes.map((vehicleType) => (
          <tr key={vehicleType.id}>
            <td className="border p-2">{vehicleType.name}</td>
            <td className="border p-2">{vehicleType.firstHourRate}</td>
            <td className="border p-2">
              {vehicleType.additionalHourRate}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}