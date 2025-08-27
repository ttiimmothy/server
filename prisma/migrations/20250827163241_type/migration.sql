/*
  Warnings:

  - You are about to drop the column `cancelled_at` on the `subscriptions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "cancelled_at",
ADD COLUMN     "canceled_at" TIMESTAMP(3);
