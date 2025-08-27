/*
  Warnings:

  - You are about to drop the column `durationMonths` on the `availableplans` table. All the data in the column will be lost.
  - Added the required column `duration_months` to the `availableplans` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."availableplans" DROP COLUMN "durationMonths",
ADD COLUMN     "duration_months" DOUBLE PRECISION NOT NULL;
