import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EventCapacityAllocationsService } from './event_capacity_allocations.service';
import { CreateEventCapacityAllocationDto } from './dto/create-event_capacity_allocation.dto';
import { CreateEventCapacityAllocationsPairDto } from './dto/create-event_capacity_allocations-pair.dto';
import { UpdateEventCapacityAllocationDto } from './dto/update-event_capacity_allocation.dto';

@Controller('event-capacity-allocations')
export class EventCapacityAllocationsController {
  constructor(private readonly eventCapacityAllocationsService: EventCapacityAllocationsService) {}

  @Post('create')
  create(@Body() createPairDto: CreateEventCapacityAllocationsPairDto) {
    return this.eventCapacityAllocationsService.create(createPairDto.allocations);
  }

  @Get('event/:eventId')
  findAll(@Param('eventId') eventId: string) {
    return this.eventCapacityAllocationsService.findAll(eventId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventCapacityAllocationsService.findOne(id);
  }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateEventCapacityAllocationDto: UpdateEventCapacityAllocationDto) {
//     return this.eventCapacityAllocationsService.update(id, updateEventCapacityAllocationDto);
//   }

  @Post('add')
  add(@Body() createEventCapacityAllocationDto: CreateEventCapacityAllocationDto) {
    return this.eventCapacityAllocationsService.add(createEventCapacityAllocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventCapacityAllocationsService.remove(id);
  }
}
