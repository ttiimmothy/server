/*
  Warnings:

  - You are about to drop the column `googleSub` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[google_sub]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."users_googleSub_key";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "googleSub",
ADD COLUMN     "google_sub" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_google_sub_key" ON "public"."users"("google_sub");
