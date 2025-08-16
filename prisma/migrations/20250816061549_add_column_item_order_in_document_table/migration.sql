/*
  Warnings:

  - Added the required column `item_order` to the `documents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "item_order" INTEGER NOT NULL;
