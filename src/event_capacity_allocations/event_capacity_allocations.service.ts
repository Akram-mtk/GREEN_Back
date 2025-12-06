import { Injectable } from '@nestjs/common';
import { CreateEventCapacityAllocationDto } from './dto/create-event_capacity_allocation.dto';
import { UpdateEventCapacityAllocationDto } from './dto/update-event_capacity_allocation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EventCapacityAllocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventCapacityAllocationDto: CreateEventCapacityAllocationDto) {
    return await this.prisma.eventCapacityAllocation.create({
      data: createEventCapacityAllocationDto
    });
  }

  async findAll() {
    return await this.prisma.eventCapacityAllocation.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.eventCapacityAllocation.findUnique({
      where: { id: id }
    });
  }

  async update(id: string, updateEventCapacityAllocationDto: UpdateEventCapacityAllocationDto) {
    return await this.prisma.eventCapacityAllocation.update({
      where: { id: id },
      data: updateEventCapacityAllocationDto
    });
  }

  async remove(id: string) {
    return await this.prisma.eventCapacityAllocation.delete({
      where: { id: id }
    });
  }
}
