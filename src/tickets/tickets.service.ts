import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService, TicketEmailData } from '../mail/mail.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(order_id: string) {
    let recipientEmail: string | null = null;
    let eventDetails: any = null;
    const qrTickets: TicketEmailData[] = [];

    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: order_id },
        include: {
          companions: true,
          Users: true,
          EventCapacityAllocation: {
            include: {
              Event: {
                include: {
                  home_team: true,
                  away_team: true,
                },
              },
              Area: true,
            },
          },
        },
      });
      if (!order) throw new NotFoundException('Order not found');

      const adultItems = order.companions.filter(c => !c.isMinor);
      const minorItems = order.companions.filter(c => c.isMinor);
      const isRfidOrder = adultItems.some(a => a.user_id !== null);

      const userIds = order.companions
        .map(c => c.user_id)
        .filter((id): id is string => id !== null);
      if (userIds.length) {
        const existingTicket = await tx.ticket.findFirst({
          where: {
            user_id: { in: userIds },
            EventCapacityAllocation: { event_id: order.EventCapacityAllocation.event_id },
          },
        });
        if (existingTicket) {
          throw new ConflictException('One or more attendees already have a ticket for this event');
        }
      }

      if (!isRfidOrder) {
        recipientEmail = order.Users.email;
      }

      // Extract event details for email
      eventDetails = order.EventCapacityAllocation;
      const matchDate = new Date(eventDetails.Event.start_at);
      const formattedDate = matchDate.toLocaleDateString('fr-FR');
      const formattedTime = matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const matchName = `${eventDetails.Event.home_team.name} vs ${eventDetails.Event.away_team.name}`;
      const teamName = eventDetails.home_team_area ? eventDetails.Event.home_team.name : eventDetails.Event.away_team.name;

      // Phase 1: adult tickets — map orderItemId → ticketId
      const ticketIdMap = new Map<string, string>();
      for (const item of adultItems) {
        const qr_code = item.user_id ? null : randomUUID();
        const ticket = await tx.ticket.create({
          data: {
            user_id: item.user_id,
            first_name: item.first_name,
            last_name: item.last_name,
            allocation_id: order.allocation_id,
            isMinor: false,
            parent_ticket_id: null,
            qr_code,
          },
        });
        if (qr_code) {
          qrTickets.push({
            id: ticket.id,
            qr_code,
            first_name: item.first_name,
            last_name: item.last_name,
            is_minor: false,
            match_name: matchName,
            match_date: formattedDate,
            match_time: formattedTime,
            area_name: eventDetails.Area.name,
            team_name: teamName,
          });
        }
        ticketIdMap.set(item.id, ticket.id);
      }

      // Phase 2: minor tickets
      for (const item of minorItems) {
        const parentTicketId = item.parent_order_item_id
          ? ticketIdMap.get(item.parent_order_item_id) ?? null
          : null;

        const qr_code = isRfidOrder ? null : randomUUID();
        await tx.ticket.create({
          data: {
            user_id: null,
            first_name: item.first_name,
            last_name: item.last_name,
            allocation_id: order.allocation_id,
            isMinor: true,
            parent_ticket_id: parentTicketId,
            qr_code,
          },
        });
        if (qr_code) {
          const parentItem = item.parent_order_item_id
            ? adultItems.find(a => a.id === item.parent_order_item_id)
            : null;
          qrTickets.push({
            id: '',
            qr_code,
            first_name: item.first_name,
            last_name: item.last_name,
            is_minor: true,
            parent_first_name: parentItem?.first_name,
            parent_last_name: parentItem?.last_name,
            match_name: matchName,
            match_date: formattedDate,
            match_time: formattedTime,
            area_name: eventDetails.Area.name,
            team_name: teamName,
          });
        }
      }

      await tx.order.delete({ where: { id: order_id } });
    });

    if (recipientEmail && qrTickets.length > 0) {
      this.mailService.sendTicketQrCodes(recipientEmail, qrTickets);
    }
  }

  async findAll() {
    return await this.prisma.ticket.findMany();
  }

  async findMine(userId: string) {
    const tickets = await this.prisma.ticket.findMany({
      where: { user_id: userId },
      include: {
        Users: { include: { Rfid_cards: true } },
        parent_ticket: { select: { first_name: true, last_name: true } },
        EventCapacityAllocation: {
          include: {
            Area: { select: { name: true } },
            Event: {
              include: { home_team: true, away_team: true },
            },
          },
        },
      },
    });

    return tickets.map((t) => ({
      id: t.id,
      rfid_card_id: t.Users?.Rfid_cards[0]?.id ?? null,
      qr_code: t.qr_code,
      first_name: t.first_name,
      last_name: t.last_name,
      is_minor: t.isMinor,
      parent_first_name: t.parent_ticket?.first_name ?? null,
      parent_last_name: t.parent_ticket?.last_name ?? null,
      allocation: {
        Area: { name: t.EventCapacityAllocation.Area.name },
      },
      event: {
        name: `${t.EventCapacityAllocation.Event.home_team.name} vs ${t.EventCapacityAllocation.Event.away_team.name}`,
        start_at: t.EventCapacityAllocation.Event.start_at,
      },
    }));
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
