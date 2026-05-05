import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateEventCapacityAllocationDto } from './dto/create-event_capacity_allocation.dto';
import { UpdateEventCapacityAllocationDto } from './dto/update-event_capacity_allocation.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventCapacityAllocationsService {
  constructor(private prisma: PrismaService) {}

  async create(createEventCapacityAllocationDto: CreateEventCapacityAllocationDto) {
    try {
      return await this.prisma.eventCapacityAllocation.create({
        data: createEventCapacityAllocationDto
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('An allocation for this area already exists for this event');
      }
      throw err;
    }
  }

  async findAll(eventId: string) {
    return await this.prisma.eventCapacityAllocation.findMany({
      where: { event_id: eventId }
    });
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
    const allocation = await this.prisma.eventCapacityAllocation.findUnique({
      where: { id }
    });
    if (!allocation) throw new NotFoundException('EventCapacityAllocation not found');

    try {
      return await this.prisma.eventCapacityAllocation.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error.code === 'P2014') {
        throw new ConflictException('Cannot delete allocation with existing tickets or orders');
      }
      throw error;
    }
  }
}
