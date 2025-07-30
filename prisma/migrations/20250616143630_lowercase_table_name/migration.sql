/*
  Warnings:

  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CheckListItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceProviders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDocuments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSubscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckListItems" DROP CONSTRAINT "CheckListItems_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CheckListItems" DROP CONSTRAINT "CheckListItems_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDocuments" DROP CONSTRAINT "UserDocuments_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteServiceProvider" DROP CONSTRAINT "UserFavoriteServiceProvider_serviceProviderId_fkey";

-- DropForeignKey
ALTER TABLE "UserFavoriteServiceProvider" DROP CONSTRAINT "UserFavoriteServiceProvider_userId_fkey";

-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToServiceProvider" DROP CONSTRAINT "_CategoryToServiceProvider_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToServiceProvider" DROP CONSTRAINT "_CategoryToServiceProvider_B_fkey";

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "CheckListItems";

-- DropTable
DROP TABLE "ServiceProviders";

-- DropTable
DROP TABLE "UserDocuments";

-- DropTable
DROP TABLE "UserSubscriptions";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "displayName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "photoURL" TEXT,
    "phoneNumber" VARCHAR(255),
    "bio" TEXT,
    "password" TEXT NOT NULL,
    "notificationPreferences" JSONB,
    "accountStatus" JSONB,
    "privacySettings" JSONB,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "subscriptionId" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "iconName" VARCHAR(255),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "itemOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkListItems" (
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

    CONSTRAINT "checkListItems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "serviceProviders" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contactInfo" JSONB,
    "servicesOffered" TEXT[],
    "operationHours" JSONB,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "logoUrl" TEXT,
    "images" JSONB,
    "averageRating" INTEGER,
    "reviewCount" INTEGER,
    "tags" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "serviceProviders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userDocuments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "templateId" TEXT,
    "fileUrl" TEXT,
    "filePathInStorage" TEXT,
    "localFilePath" TEXT,
    "fileName" TEXT,
    "fileType" TEXT,
    "fileSize" INTEGER,
    "encryptionIv" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "searchText" TEXT,
    "isAvailableOffline" BOOLEAN,
    "isEncrypted" BOOLEAN,
    "tags" JSONB,
    "notes" TEXT,

    CONSTRAINT "userDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userSubscriptions" (
    "id" UUID NOT NULL,
    "planId" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),

    CONSTRAINT "userSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "categories_itemOrder_key" ON "categories"("itemOrder");

-- CreateIndex
CREATE UNIQUE INDEX "checkListItems_itemOrder_key" ON "checkListItems"("itemOrder");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "userSubscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkListItems" ADD CONSTRAINT "checkListItems_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkListItems" ADD CONSTRAINT "checkListItems_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteServiceProvider" ADD CONSTRAINT "UserFavoriteServiceProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavoriteServiceProvider" ADD CONSTRAINT "UserFavoriteServiceProvider_serviceProviderId_fkey" FOREIGN KEY ("serviceProviderId") REFERENCES "serviceProviders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userDocuments" ADD CONSTRAINT "userDocuments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToServiceProvider" ADD CONSTRAINT "_CategoryToServiceProvider_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToServiceProvider" ADD CONSTRAINT "_CategoryToServiceProvider_B_fkey" FOREIGN KEY ("B") REFERENCES "serviceProviders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
