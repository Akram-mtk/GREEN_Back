import { Test, TestingModule } from '@nestjs/testing';
import { OrderCleanerService } from './order-cleaner.service';

describe('OrderCleanerService', () => {
  let service: OrderCleanerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderCleanerService],
    }).compile();

    service = module.get<OrderCleanerService>(OrderCleanerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
