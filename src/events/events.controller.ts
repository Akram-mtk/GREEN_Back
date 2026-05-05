import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventEntity } from './entities/event.entity';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('create')
  async create(@Body() createEventDto: CreateEventDto) {
    return new EventEntity(await this.eventsService.create(createEventDto));
  }

  @Get('getAll')
  async findAll() {
    const events = await this.eventsService.findAll();
    return events.map(e => new EventEntity(e));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);
    if (!event) throw new NotFoundException();
    return new EventEntity(event);
  }

  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return new EventEntity(await this.eventsService.publish(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return new EventEntity(await this.eventsService.update(id, updateEventDto));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
