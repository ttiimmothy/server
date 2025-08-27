-- AlterTable
ALTER TABLE "public"."subscriptions" ALTER COLUMN "stripe_subscription_id" DROP NOT NULL,
ALTER COLUMN "stripe_price_id" DROP NOT NULL;
