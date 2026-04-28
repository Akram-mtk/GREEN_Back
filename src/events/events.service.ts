import { Injectable } from '@nestjs/common';
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
      where: { published: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.event.findFirst({
      where: { id, published: true },
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    return await this.prisma.event.update({
      where: { id: id },
      data: updateEventDto
    });
  }

  async remove(id: string) {
    return await this.prisma.event.delete({
      where: { id: id }
    });
  }
}
