/*
  Warnings:

  - You are about to drop the column `minor_full_name` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `minor_full_name` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "minor_full_name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "parent_order_item_id" UUID;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "minor_full_name",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "qr_code" TEXT;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_parent_order_item_id_fkey" FOREIGN KEY ("parent_order_item_id") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
