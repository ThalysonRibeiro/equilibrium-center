-- CreateTable
CREATE TABLE "Assessments" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "assessment" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Assessments" ADD CONSTRAINT "Assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
