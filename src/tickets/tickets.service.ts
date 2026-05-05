import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(order_id: string) {
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: order_id },
        include: { companions: true },
      });
      if (!order) throw new NotFoundException('Order not found');

      const adultItems = order.companions.filter(c => !c.isMinor);
      const minorItems = order.companions.filter(c => c.isMinor);
      const isRfidOrder = adultItems.some(a => a.user_id !== null);

      // Phase 1: adult tickets — map orderItemId → ticketId
      const ticketIdMap = new Map<string, string>();
      for (const item of adultItems) {
        const ticket = await tx.ticket.create({
          data: {
            user_id: item.user_id,
            first_name: item.first_name,
            last_name: item.last_name,
            allocation_id: order.allocation_id,
            isMinor: false,
            parent_ticket_id: null,
            qr_code: item.user_id ? null : randomUUID(),
          },
        });
        ticketIdMap.set(item.id, ticket.id);
      }

      // Phase 2: minor tickets
      for (const item of minorItems) {
        const parentTicketId = item.parent_order_item_id
          ? ticketIdMap.get(item.parent_order_item_id) ?? null
          : null;

        await tx.ticket.create({
          data: {
            user_id: null,
            first_name: item.first_name,
            last_name: item.last_name,
            allocation_id: order.allocation_id,
            isMinor: true,
            parent_ticket_id: parentTicketId,
            qr_code: isRfidOrder ? null : randomUUID(),
          },
        });
      }

      await tx.order.delete({ where: { id: order_id } });
    });
  }

  async findAll() {
    return await this.prisma.ticket.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.ticket.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {}

  async remove(id: string) {
    const ticket = await this.prisma.ticket.findUnique({ where: { id } });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.delete({ where: { id } });
      await tx.eventCapacityAllocation.update({
        where: { id: ticket.allocation_id },
        data: { available_seats: { increment: 1 } },
      });
    });
  }
}
