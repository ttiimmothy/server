-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_subscriptionId_fkey";

-- AlterTable
ALTER TABLE "ServiceProviders" ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UserDocuments" ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "fileName" DROP NOT NULL,
ALTER COLUMN "fileType" DROP NOT NULL,
ALTER COLUMN "fileSize" DROP NOT NULL,
ALTER COLUMN "tags" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "subscriptionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "UserSubscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
