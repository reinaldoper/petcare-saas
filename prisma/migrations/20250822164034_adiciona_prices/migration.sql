-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "priority" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Stock" ADD COLUMN     "price" DOUBLE PRECISION;
