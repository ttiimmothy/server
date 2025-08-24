/*
  Warnings:

  - The primary key for the `favoriteserviceproviders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "public"."favoriteserviceproviders" DROP CONSTRAINT "favoriteserviceproviders_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "favoriteserviceproviders_pkey" PRIMARY KEY ("id");
