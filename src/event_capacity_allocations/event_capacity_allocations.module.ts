import { Module } from '@nestjs/common';
import { EventCapacityAllocationsService } from './event_capacity_allocations.service';
import { EventCapacityAllocationsController } from './event_capacity_allocations.controller';

@Module({
  controllers: [EventCapacityAllocationsController],
  providers: [EventCapacityAllocationsService],
})
export class EventCapacityAllocationsModule {}
