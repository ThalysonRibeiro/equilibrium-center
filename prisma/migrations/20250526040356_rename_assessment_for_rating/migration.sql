/*
  Warnings:

  - You are about to drop the column `assessment` on the `Assessments` table. All the data in the column will be lost.
  - Added the required column `rating` to the `Assessments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assessments" DROP COLUMN "assessment",
ADD COLUMN     "rating" INTEGER NOT NULL;
