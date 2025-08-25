/*
  Warnings:

  - You are about to drop the column `stripePriceId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `subscriptions` table. All the data in the column will be lost.
  - Added the required column `stripe_price_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripe_subscription_id` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."subscriptions" DROP COLUMN "stripePriceId",
DROP COLUMN "stripeSubscriptionId",
ADD COLUMN     "stripe_price_id" VARCHAR(255) NOT NULL,
ADD COLUMN     "stripe_subscription_id" VARCHAR(255) NOT NULL;
