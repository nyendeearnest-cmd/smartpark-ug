export interface Vehicle {
  id: string;
  numberPlate: string;
  driverName: string;
  driverPhone: string;

  vehicleTypeId: string;
  vehicleType?: {
    id: string;
    name: string;
  };

  createdAt?: string;
  updatedAt?: string;
}