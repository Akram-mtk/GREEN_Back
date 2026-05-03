/*
  Warnings:

  - You are about to drop the column `any_gate_entry` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `order` table. All the data in the column will be lost.
  - Made the column `description` on table `SubscriptionPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_event_id_fkey";

-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_event_id_fkey";

-- DropIndex
DROP INDEX "order_user_id_event_id_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "any_gate_entry";

-- AlterTable
ALTER TABLE "EventCapacityAllocation" ADD COLUMN     "home_team_area" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL DEFAULT 3;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "event_id";

-- AlterTable
ALTER TABLE "order" DROP COLUMN "event_id";
