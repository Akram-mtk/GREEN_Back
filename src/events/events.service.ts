import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EventEntity } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventDto: CreateEventDto) {
    return await this.prisma.event.create({
      data: createEventDto
    });
  }

  async findAll() {
    return await this.prisma.event.findMany({
      where: { published: true, deletedAt: null },
      include: { home_team: true, away_team: true },
      omit: { published: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.event.findFirst({
      where: { id, published: true, deletedAt: null },
      include: { home_team: true, away_team: true },
      omit: { published: true },
    });
  }

  async publish(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    const allocationCount = await this.prisma.eventCapacityAllocation.count({ where: { event_id: id } });
    if (allocationCount === 0) throw new BadRequestException('Event must have at least one capacity allocation before publishing');

    return await this.prisma.event.update({
      where: { id },
      data: { published: true },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (event?.published) throw new BadRequestException('Cannot update a published event');
    return await this.prisma.event.update({
      where: { id },
      data: updateEventDto,
    });
  }

  async remove(id: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');
    if (event.published) throw new BadRequestException('Cannot delete a published event');
    return await this.prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
