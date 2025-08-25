/*
  Warnings:

  - Added the required column `stripePriceId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "stripePriceId" VARCHAR(255) NOT NULL,
ADD COLUMN     "stripeSubscriptionId" VARCHAR(255) NOT NULL;
