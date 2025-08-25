/*
  Warnings:

  - You are about to drop the column `subscription_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_subscription_id_fkey";

-- AlterTable
ALTER TABLE "public"."subscriptions" ADD COLUMN     "status" VARCHAR(255) NOT NULL,
ADD COLUMN     "user_id" UUID;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "subscription_id";

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_user_id_key" ON "public"."subscriptions"("user_id");

-- AddForeignKey
ALTER TABLE "public"."subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
