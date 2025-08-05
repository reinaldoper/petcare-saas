/*
  Warnings:

  - Added the required column `clinicId` to the `VaccineHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "clinicId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "VaccineHistory" ADD COLUMN     "clinicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VaccineHistory" ADD CONSTRAINT "VaccineHistory_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
