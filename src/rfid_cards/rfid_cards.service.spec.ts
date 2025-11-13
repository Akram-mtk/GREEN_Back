import { Test, TestingModule } from '@nestjs/testing';
import { RfidCardsService } from './rfid_cards.service';

describe('RfidCardsService', () => {
  let service: RfidCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfidCardsService],
    }).compile();

    service = module.get<RfidCardsService>(RfidCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
