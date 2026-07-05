-- DropForeignKey
ALTER TABLE "ParkingRecord" DROP CONSTRAINT "ParkingRecord_checkedInById_fkey";

-- AlterTable
ALTER TABLE "ParkingRecord" ALTER COLUMN "checkedInById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ParkingRecord" ADD CONSTRAINT "ParkingRecord_checkedInById_fkey" FOREIGN KEY ("checkedInById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
