import { Test, TestingModule } from '@nestjs/testing';
import { EventCapacityAllocationsService } from './event_capacity_allocations.service';

describe('EventCapacityAllocationsService', () => {
  let service: EventCapacityAllocationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventCapacityAllocationsService],
    }).compile();

    service = module.get<EventCapacityAllocationsService>(EventCapacityAllocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
