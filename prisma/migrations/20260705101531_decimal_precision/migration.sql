/*
  Warnings:

  - You are about to alter the column `firstHourRate` on the `VehicleType` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `additionalHourRate` on the `VehicleType` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "VehicleType" ALTER COLUMN "firstHourRate" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "additionalHourRate" SET DATA TYPE DECIMAL(10,2);
