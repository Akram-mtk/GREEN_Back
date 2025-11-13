import { Test, TestingModule } from '@nestjs/testing';
import { RfidCardsController } from './rfid_cards.controller';
import { RfidCardsService } from './rfid_cards.service';

describe('RfidCardsController', () => {
  let controller: RfidCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RfidCardsController],
      providers: [RfidCardsService],
    }).compile();

    controller = module.get<RfidCardsController>(RfidCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
