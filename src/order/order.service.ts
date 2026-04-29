import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    return this.prisma.$transaction(async (tx) => {
      // Collision check — buyer
      const [buyerTicket, buyerOrder] = await Promise.all([
        tx.ticket.findFirst({ where: { user_id: dto.user_id, event_id: dto.event_id } }),
        tx.order.findFirst({ where: { user_id: dto.user_id, event_id: dto.event_id } }),
      ]);
      if (buyerTicket || buyerOrder) {
        throw new ConflictException('User already has a ticket or pending order for this event');
      }

      // Collision check — adult companions
      const adultCompanionIds = dto.companions
        .filter(c => !c.isMinor)
        .map(c => c.user_id!);
      if (adultCompanionIds.length) {
        const [companionTicket, companionOrderItem] = await Promise.all([
          tx.ticket.findFirst({ where: { user_id: { in: adultCompanionIds }, event_id: dto.event_id } }),
          tx.orderItem.findFirst({ where: { user_id: { in: adultCompanionIds }, order: { event_id: dto.event_id } } }),
        ]);
        if (companionTicket || companionOrderItem) {
          throw new ConflictException('One or more companions already have a ticket or pending order for this event');
        }
      }

      // Capacity decrement
      const totalSeats = 1 + dto.companions.length;
      const updated = await tx.eventCapacityAllocation.updateMany({
        where: { id: dto.allocation_id, available_seats: { gte: totalSeats } },
        data: { available_seats: { decrement: totalSeats } },
      });
      if (updated.count === 0) {
        throw new ConflictException('SOLD_OUT: Not enough seats available');
      }

      // Create order + companions atomically
      return tx.order.create({
        data: {
          user_id: dto.user_id,
          event_id: dto.event_id,
          allocation_id: dto.allocation_id,
          companions: {
            create: dto.companions.map(c => ({
              isMinor: c.isMinor,
              user_id: c.isMinor ? null : c.user_id,
              minor_full_name: c.isMinor ? c.minor_full_name : null,
            })),
          },
        },
        include: { companions: true },
      });
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { companions: true },
    });
  }

  async findByUser(user_id: string) {
    return this.prisma.order.findMany({
      where: { user_id },
      include: { companions: true },
    });
  }

  async remove(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: { _count: { select: { companions: true } } },
      });
      if (!order) throw new NotFoundException('Order not found');

      const seatsToRestore = 1 + order._count.companions;

      await tx.eventCapacityAllocation.update({
        where: { id: order.allocation_id },
        data: { available_seats: { increment: seatsToRestore } },
      });

      await tx.order.delete({ where: { id } }); // cascades to OrderItems
    });
  }
}
