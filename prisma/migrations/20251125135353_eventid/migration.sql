/*
  Warnings:

  - A unique constraint covering the columns `[event_id,user_id]` on the table `Ticket` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_id` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Ticket_allocation_id_user_id_key";

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "areaId" UUID,
ADD COLUMN     "event_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "created_at" TIMESTAMPTZ(0) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_event_id_user_id_key" ON "Ticket"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;
