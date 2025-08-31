/*
  Warnings:

  - A unique constraint covering the columns `[razaoSocial]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `Clinic` will be added. If there are existing duplicate values, this will fail.
  - Made the column `cnpj` on table `Clinic` required. This step will fail if there are existing NULL values in that column.
  - Made the column `razaoSocial` on table `Clinic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clinic" ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "razaoSocial" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_razaoSocial_key" ON "Clinic"("razaoSocial");

-- CreateIndex
CREATE UNIQUE INDEX "Clinic_cnpj_key" ON "Clinic"("cnpj");
