/*
  Warnings:

  - Added the required column `schedulesId` to the `Hours` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hours" ADD COLUMN     "schedulesId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Schedules" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Hours" ADD CONSTRAINT "Hours_schedulesId_fkey" FOREIGN KEY ("schedulesId") REFERENCES "Schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
