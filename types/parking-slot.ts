export interface ParkingSlot {
  id: string;
  slotNumber: string;
  zone: "A" | "B" | "C";
  status: "AVAILABLE" | "OCCUPIED";
  condition: "ACTIVE" | "RESERVED" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
}