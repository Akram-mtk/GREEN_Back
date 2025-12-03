import { Injectable } from '@nestjs/common';
import { CreateEventCapacityAllocationDto } from './dto/create-event_capacity_allocation.dto';
import { UpdateEventCapacityAllocationDto } from './dto/update-event_capacity_allocation.dto';

@Injectable()
export class EventCapacityAllocationsService {
  create(createEventCapacityAllocationDto: CreateEventCapacityAllocationDto) {
    return 'This action adds a new eventCapacityAllocation';
  }

  findAll() {
    return `This action returns all eventCapacityAllocations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} eventCapacityAllocation`;
  }

  update(id: number, updateEventCapacityAllocationDto: UpdateEventCapacityAllocationDto) {
    return `This action updates a #${id} eventCapacityAllocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventCapacityAllocation`;
  }
}
