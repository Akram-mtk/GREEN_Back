import { Module } from '@nestjs/common';
import { RfidCardsService } from './rfid_cards.service';
import { RfidCardsController } from './rfid_cards.controller';

@Module({
  controllers: [RfidCardsController],
  providers: [RfidCardsService],
})
export class RfidCardsModule {}
