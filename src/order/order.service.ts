import {
  Injectable, NotFoundException, ConflictException,
  BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CardStatus } from '@prisma/client';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    // --- Pre-transaction validation ---
    const adults = dto.attendees.filter(a => !a.isMinor);
    const minors = dto.attendees.filter(a => a.isMinor);

    // Determine adult identification method
    const rfidAdults = adults.filter(a => a.card_uid);
    const nameAdults = adults.filter(a => a.first_name || a.last_name);

    if (rfidAdults.length > 0 && nameAdults.length > 0) {
      throw new BadRequestException('Cannot mix RFID and name identification for adults in the same order');
    }
    if (adults.length > 0) {
      if (rfidAdults.length > 0 && rfidAdults.length !== adults.length) {
        throw new BadRequestException('All adults must use RFID identification when any adult uses RFID');
      }
      if (nameAdults.length > 0 && nameAdults.length !== adults.length) {
        throw new BadRequestException('All adults must use name identification when any adult uses name');
      }
      if (rfidAdults.length === 0 && nameAdults.length === 0) {
        throw new BadRequestException('Each adult attendee must provide either card_uid or first_name + last_name');
      }
    }

    // Validate name-identified adults have both names
    for (const adult of nameAdults) {
      if (!adult.first_name || !adult.last_name) {
        throw new BadRequestException('Name-identified adults must provide both first_name and last_name');
      }
    }

    // Validate minors
    for (const minor of minors) {
      if (!minor.first_name || !minor.last_name) {
        throw new BadRequestException('Minors must provide both first_name and last_name');
      }
      if (minor.parent_index === undefined || minor.parent_index === null) {
        throw new BadRequestException('Each minor must specify a parent_index pointing to a supervising adult');
      }
      const parent = dto.attendees[minor.parent_index];
      if (!parent || parent.isMinor) {
        throw new BadRequestException(`parent_index ${minor.parent_index} does not point to a valid adult attendee`);
      }
    }

    return this.prisma.$transaction(async (tx) => {
      // --- Resolve RFID adults → user_id ---
      type ResolvedAttendee = { user_id: string | null; first_name: string | null; last_name: string | null };
      const resolved: ResolvedAttendee[] = await Promise.all(
        dto.attendees.map(async (attendee) => {
          if (attendee.isMinor || !attendee.card_uid) {
            return { user_id: null, first_name: attendee.first_name ?? null, last_name: attendee.last_name ?? null };
          }

          const card = await tx.rfid_cards.findFirst({
            where: { card_uid: attendee.card_uid, status: CardStatus.active },
            include: { owner: { select: { first_name: true, last_name: true } } },
          });
          if (!card) throw new NotFoundException(`RFID card '${attendee.card_uid}' not found or not active`);
          if (!card.owner_id || !card.owner) throw new ForbiddenException(`RFID card '${attendee.card_uid}' has no owner`);
          return { user_id: card.owner_id, first_name: card.owner.first_name, last_name: card.owner.last_name };
        }),
      );
      const resolvedUserIds = resolved.map(r => r.user_id);

      // --- Collision check for RFID adults ---
      const rfidUserIds = resolvedUserIds.filter((id): id is string => id !== null);
      if (rfidUserIds.length) {
        const [conflictTicket, conflictItem] = await Promise.all([
          tx.ticket.findFirst({ where: { user_id: { in: rfidUserIds }, event_id: dto.event_id } }),
          tx.orderItem.findFirst({ where: { user_id: { in: rfidUserIds }, order: { event_id: dto.event_id } } }),
        ]);
        if (conflictTicket || conflictItem) {
          throw new ConflictException('One or more attendees already have a ticket or pending order for this event');
        }
      }

      // --- Capacity ---
      const totalSeats = dto.attendees.length;
      const updated = await tx.eventCapacityAllocation.updateMany({
        where: { id: dto.allocation_id, available_seats: { gte: totalSeats } },
        data: { available_seats: { decrement: totalSeats } },
      });
      if (updated.count === 0) {
        throw new ConflictException('SOLD_OUT: Not enough seats available');
      }

      // --- Pre-generate UUIDs for adults (needed so minors can reference parent_order_item_id) ---
      const attendeeIds: string[] = dto.attendees.map(() => randomUUID());

      // --- Build OrderItem data ---
      const orderItemsData = dto.attendees.map((attendee, i) => {
        const parentOrderItemId = attendee.isMinor && attendee.parent_index !== undefined
          ? attendeeIds[attendee.parent_index]
          : undefined;

        return {
          id: attendeeIds[i],
          isMinor: attendee.isMinor,
          user_id: resolved[i].user_id,
          first_name: resolved[i].first_name,
          last_name: resolved[i].last_name,
          parent_order_item_id: parentOrderItemId ?? null,
        };
      });

      return tx.order.create({
        data: {
          user_id: dto.user_id,
          event_id: dto.event_id,
          allocation_id: dto.allocation_id,
          companions: { create: orderItemsData },
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

      const seatsToRestore = order._count.companions;

      await tx.eventCapacityAllocation.update({
        where: { id: order.allocation_id },
        data: { available_seats: { increment: seatsToRestore } },
      });

      await tx.order.delete({ where: { id } });
    });
  }
}
