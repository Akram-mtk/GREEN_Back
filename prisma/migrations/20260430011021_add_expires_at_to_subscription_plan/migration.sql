/*
  Warnings:

  - You are about to drop the column `expires_at` on the `UserSubscription` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `SubscriptionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubscriptionPlan" ADD COLUMN     "expires_at" TIMESTAMPTZ(0) NOT NULL;

-- AlterTable
ALTER TABLE "UserSubscription" DROP COLUMN "expires_at";
