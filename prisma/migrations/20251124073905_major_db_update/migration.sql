/*
  Warnings:

  - You are about to drop the `Gates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RfidCards` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeatCategories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Seats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CardStatus" AS ENUM ('issued', 'active', 'blocked');

-- DropForeignKey
ALTER TABLE "RfidCards" DROP CONSTRAINT "RfidCards_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Seats" DROP CONSTRAINT "Seats_category_id_fkey";

-- DropTable
DROP TABLE "Gates";

-- DropTable
DROP TABLE "RfidCards";

-- DropTable
DROP TABLE "SeatCategories";

-- DropTable
DROP TABLE "Seats";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "card_uid" VARCHAR(64) NOT NULL,
    "status" "CardStatus" NOT NULL DEFAULT 'issued',

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "any_gate_entry" BOOLEAN NOT NULL,
    "open_at" TIMESTAMP(3) NOT NULL,
    "close_at" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Area" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCapacityAllocation" (
    "id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,
    "available_seats" INTEGER NOT NULL,

    CONSTRAINT "EventCapacityAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" UUID NOT NULL,
    "allocation_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "from" DATE NOT NULL,
    "to" DATE NOT NULL,
    "owner_id" UUID NOT NULL,
    "area_id" UUID NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntryLog" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "event_id" UUID NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntryLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EventCapacityAllocation_event_id_area_id_key" ON "EventCapacityAllocation"("event_id", "area_id");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_allocation_id_user_id_key" ON "Ticket"("allocation_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "EntryLog_user_id_event_id_key" ON "EntryLog"("user_id", "event_id");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCapacityAllocation" ADD CONSTRAINT "EventCapacityAllocation_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCapacityAllocation" ADD CONSTRAINT "EventCapacityAllocation_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_allocation_id_fkey" FOREIGN KEY ("allocation_id") REFERENCES "EventCapacityAllocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "Area"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntryLog" ADD CONSTRAINT "EntryLog_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
