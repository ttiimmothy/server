/*
  Warnings:

  - You are about to drop the column `userId` on the `checklists` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `checklists` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."checklists" DROP CONSTRAINT "checklists_userId_fkey";

-- AlterTable
ALTER TABLE "public"."checklists" DROP COLUMN "userId",
ADD COLUMN     "finialized_at" TIMESTAMP(3),
ADD COLUMN     "user_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
