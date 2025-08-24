/*
  Warnings:

  - You are about to drop the column `is_completed` on the `checklists` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `checklists` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."checklists" DROP CONSTRAINT "checklists_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."checklists" DROP COLUMN "is_completed",
DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "public"."usercompletechecklists" (
    "id" SERIAL NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,
    "checklist_id" UUID NOT NULL,

    CONSTRAINT "usercompletechecklists_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."usercompletechecklists" ADD CONSTRAINT "usercompletechecklists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."usercompletechecklists" ADD CONSTRAINT "usercompletechecklists_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
