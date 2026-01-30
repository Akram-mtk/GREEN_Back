/*
  Warnings:

  - You are about to alter the column `price` on the `SubscriptionPlan` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - You are about to drop the column `areaId` on the `Ticket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[card_uid]` on the table `Rfid_cards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[short_name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `start_at` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Rfid_cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_areaId_fkey";

-- AlterTable
ALTER TABLE "EntryLog" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Rfid_cards" ADD COLUMN     "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMPTZ(0) NOT NULL;

-- AlterTable
ALTER TABLE "SubscriptionPlan" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "areaId";

-- CreateIndex
CREATE UNIQUE INDEX "Rfid_cards_card_uid_key" ON "Rfid_cards"("card_uid");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_short_name_key" ON "Team"("short_name");
