import { Test, TestingModule } from '@nestjs/testing';
import { EventCapacityAllocationsController } from './event_capacity_allocations.controller';
import { EventCapacityAllocationsService } from './event_capacity_allocations.service';

describe('EventCapacityAllocationsController', () => {
  let controller: EventCapacityAllocationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventCapacityAllocationsController],
      providers: [EventCapacityAllocationsService],
    }).compile();

    controller = module.get<EventCapacityAllocationsController>(EventCapacityAllocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
