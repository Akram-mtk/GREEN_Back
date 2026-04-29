/*
  Warnings:

  - A unique constraint covering the columns `[card_secret]` on the table `Rfid_cards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[claim_code]` on the table `Rfid_cards` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `card_secret` to the `Rfid_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Rfid_cards" ADD COLUMN     "card_secret" VARCHAR(64) NOT NULL,
ADD COLUMN     "claim_code" VARCHAR(64);

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Rfid_cards_card_secret_key" ON "Rfid_cards"("card_secret");

-- CreateIndex
CREATE UNIQUE INDEX "Rfid_cards_claim_code_key" ON "Rfid_cards"("claim_code");
