/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `serviceProviders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "serviceProviders_name_key" ON "public"."serviceProviders"("name");
