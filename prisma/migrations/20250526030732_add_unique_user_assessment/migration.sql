/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Assessments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Assessments_userId_key" ON "Assessments"("userId");
