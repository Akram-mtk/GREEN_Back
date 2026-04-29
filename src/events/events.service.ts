import { Injectable, BadRequestException } from '@nestjs/common';
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
    });
  }

  async findOne(id: string) {
    return await this.prisma.event.findFirst({
      where: { id, published: true, deletedAt: null },
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
    return await this.prisma.event.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
