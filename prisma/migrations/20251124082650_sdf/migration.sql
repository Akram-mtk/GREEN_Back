/*
  Warnings:

  - You are about to drop the `Cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Cards" DROP CONSTRAINT "Cards_owner_id_fkey";

-- DropTable
DROP TABLE "Cards";

-- CreateTable
CREATE TABLE "Rfid_cards" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "card_uid" VARCHAR(64) NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'issued',

    CONSTRAINT "Rfid_cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Rfid_cards" ADD CONSTRAINT "Rfid_cards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
