/*
  Warnings:

  - You are about to drop the `CheckListItmes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckListItmes" DROP CONSTRAINT "CheckListItmes_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListItmes" DROP CONSTRAINT "CheckListItmes_userId_fkey";

-- DropTable
DROP TABLE "CheckListItmes";

-- CreateTable
CREATE TABLE "CheckListItems" (
    "id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "categoryId" UUID NOT NULL,
    "itemOrder" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CheckListItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CheckListItems_itemOrder_key" ON "CheckListItems"("itemOrder");

-- AddForeignKey
ALTER TABLE "CheckListItems" ADD CONSTRAINT "CheckListItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckListItems" ADD CONSTRAINT "CheckListItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
