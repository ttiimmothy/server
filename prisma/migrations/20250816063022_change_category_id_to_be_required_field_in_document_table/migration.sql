/*
  Warnings:

  - Made the column `category_id` on table `documents` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."documents" ALTER COLUMN "category_id" SET NOT NULL;
