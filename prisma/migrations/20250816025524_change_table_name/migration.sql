/*
  Warnings:

  - You are about to drop the `userfavoriteserviceproviders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."userfavoriteserviceproviders" DROP CONSTRAINT "userfavoriteserviceproviders_service_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."userfavoriteserviceproviders" DROP CONSTRAINT "userfavoriteserviceproviders_user_id_fkey";

-- DropTable
DROP TABLE "public"."userfavoriteserviceproviders";

-- CreateTable
CREATE TABLE "public"."favoriteserviceproviders" (
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "user_id" UUID NOT NULL,
    "service_provider_id" UUID NOT NULL,

    CONSTRAINT "favoriteserviceproviders_pkey" PRIMARY KEY ("user_id","service_provider_id")
);

-- AddForeignKey
ALTER TABLE "public"."favoriteserviceproviders" ADD CONSTRAINT "favoriteserviceproviders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favoriteserviceproviders" ADD CONSTRAINT "favoriteserviceproviders_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "public"."serviceproviders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
