/*
  Warnings:

  - The `age` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `dateOfBirth` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "age",
ADD COLUMN     "age" INTEGER,
DROP COLUMN "dateOfBirth",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3);
