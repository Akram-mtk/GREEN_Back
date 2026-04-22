/*
  Warnings:

  - You are about to drop the column `confirmed` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "confirmed",
ADD COLUMN     "isMinor" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "order" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "group_id" UUID NOT NULL,
    "allocation_id" UUID NOT NULL,
    "isMinor" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_allocation_id_fkey" FOREIGN KEY ("allocation_id") REFERENCES "EventCapacityAllocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
