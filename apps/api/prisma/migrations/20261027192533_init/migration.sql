-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ClaimVerdict" AS ENUM ('JUSTIFIED', 'NOT_JUSTIFIED', 'INCONCLUSIVE');

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "productName" TEXT,
    "description" TEXT NOT NULL,
    "submittedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assessment" (
    "id" TEXT NOT NULL,
    "claimId" TEXT NOT NULL,
    "evidence" TEXT NOT NULL,
    "verdict" "ClaimVerdict",
    "confidenceScore" DOUBLE PRECISION,
    "reasoning" TEXT,
    "limitations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "AssessmentStatus" NOT NULL DEFAULT 'PENDING',
    "model" TEXT,
    "promptVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Assessment_claimId_createdAt_idx" ON "Assessment"("claimId", "createdAt");

-- CreateIndex
CREATE INDEX "Assessment_status_createdAt_idx" ON "Assessment"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Assessment" ADD CONSTRAINT "Assessment_claimId_fkey" FOREIGN KEY ("claimId") REFERENCES "Claim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
