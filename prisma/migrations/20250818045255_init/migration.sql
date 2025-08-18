-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "displayName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "photo_url" TEXT,
    "phone_number" VARCHAR(255),
    "bio" TEXT,
    "password" TEXT NOT NULL,
    "notification_preferences" JSONB,
    "account_status" JSONB,
    "privacy_settings" JSONB,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "subscription_id" UUID,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" UUID NOT NULL,
    "icon_name" VARCHAR(255),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "item_order" INTEGER NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."checklists" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "item_order" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "is_completed" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "category_id" UUID NOT NULL,

    CONSTRAINT "checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."serviceproviders" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "categoryIds" TEXT[],
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "contactInfo" JSONB,
    "services_offered" TEXT[],
    "operation_hours" JSONB,
    "is_verified" BOOLEAN NOT NULL DEFAULT true,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "logo_url" TEXT,
    "images" JSONB,
    "average_rating" INTEGER,
    "review_count" INTEGER,
    "tags" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "serviceproviders_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" UUID NOT NULL,
    "template_id" TEXT,
    "file_url" TEXT,
    "file_path_in_storage" TEXT,
    "local_file_path" TEXT,
    "file_name" TEXT,
    "file_type" TEXT,
    "file_size" INTEGER,
    "encryption_iv" TEXT,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "is_private" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "search_text" TEXT,
    "is_available_offline" BOOLEAN,
    "isEncrypted" BOOLEAN,
    "tags" JSONB,
    "notes" TEXT,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."subscriptions" (
    "id" UUID NOT NULL,
    "plan" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_item_order_key" ON "public"."categories"("item_order");

-- CreateIndex
CREATE UNIQUE INDEX "serviceproviders_name_key" ON "public"."serviceproviders"("name");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_subscription_id_fkey" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."checklists" ADD CONSTRAINT "checklists_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favoriteserviceproviders" ADD CONSTRAINT "favoriteserviceproviders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favoriteserviceproviders" ADD CONSTRAINT "favoriteserviceproviders_service_provider_id_fkey" FOREIGN KEY ("service_provider_id") REFERENCES "public"."serviceproviders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
