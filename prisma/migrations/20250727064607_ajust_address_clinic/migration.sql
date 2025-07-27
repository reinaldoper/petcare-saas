/*
  Warnings:

  - Made the column `address` on table `Clinic` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Clinic" ALTER COLUMN "address" SET NOT NULL;
