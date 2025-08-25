/*
  Warnings:

  - You are about to drop the column `status` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "status",
ADD COLUMN     "active_status" BOOLEAN;
