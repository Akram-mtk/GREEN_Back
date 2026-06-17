/*
  Warnings:

  - You are about to drop the column `area_id` on the `SubscriptionPlan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubscriptionPlan" DROP CONSTRAINT "SubscriptionPlan_area_id_fkey";

-- AlterTable
ALTER TABLE "SubscriptionPlan" DROP COLUMN "area_id",
ADD COLUMN     "validation_time_by_month" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserSubscription" ADD COLUMN     "area_id" UUID,
ADD COLUMN     "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMPTZ(0);

-- AddForeignKey
ALTER TABLE "UserSubscription" ADD CONSTRAINT "UserSubscription_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
