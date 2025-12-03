import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventCapacityAllocationsService } from './event_capacity_allocations.service';
import { CreateEventCapacityAllocationDto } from './dto/create-event_capacity_allocation.dto';
import { UpdateEventCapacityAllocationDto } from './dto/update-event_capacity_allocation.dto';

@Controller('event-capacity-allocations')
export class EventCapacityAllocationsController {
  constructor(private readonly eventCapacityAllocationsService: EventCapacityAllocationsService) {}

  @Post()
  create(@Body() createEventCapacityAllocationDto: CreateEventCapacityAllocationDto) {
    return this.eventCapacityAllocationsService.create(createEventCapacityAllocationDto);
  }

  @Get()
  findAll() {
    return this.eventCapacityAllocationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventCapacityAllocationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventCapacityAllocationDto: UpdateEventCapacityAllocationDto) {
    return this.eventCapacityAllocationsService.update(+id, updateEventCapacityAllocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventCapacityAllocationsService.remove(+id);
  }
}
