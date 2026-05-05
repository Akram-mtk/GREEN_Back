-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('rfid', 'qrcode');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "away_ticket_type" "TicketType" NOT NULL DEFAULT 'qrcode',
ADD COLUMN     "home_ticket_type" "TicketType" NOT NULL DEFAULT 'rfid';

-- AlterTable
ALTER TABLE "EventCapacityAllocation" ALTER COLUMN "home_team_area" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT;
