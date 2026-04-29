import { Injectable, NotFoundException } from '@nestjs/common';
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

      // Buyer ticket
      const buyerTicket = await tx.ticket.create({
        data: {
          user_id: order.user_id,
          event_id: order.event_id,
          allocation_id: order.allocation_id,
          isMinor: false,
          parent_ticket_id: null,
          minor_full_name: null,
        },
      });

      // Companion tickets
      await Promise.all(order.companions.map(companion =>
        tx.ticket.create({
          data: {
            user_id: companion.isMinor ? null : companion.user_id,
            event_id: order.event_id,
            allocation_id: order.allocation_id,
            isMinor: companion.isMinor,
            parent_ticket_id: companion.isMinor ? buyerTicket.id : null,
            minor_full_name: companion.isMinor ? companion.minor_full_name : null,
          },
        })
      ));

      await tx.order.delete({ where: { id: order_id } }); // cascades to OrderItems
    });
  }

  // async confirmTicket(id: string) {
  //   return await this.prisma.ticket.update({
  //     where: { id: id },
  //     data: { confirmed: true }
  //   });
  // }
     
 

  async findAll() {
    return await this.prisma.ticket.findMany();
  }

  async findMany(id: string) {
    return await this.prisma.ticket.findUnique({
      where: { id: id }
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    
  }

  async remove(id: string) {

    let ticket = await this.prisma.ticket.findMany({
      where: { id: id }
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }
    
    if(ticket.length > 1){
      await this.prisma.$transaction(async (tx) => {
        for (const t of ticket) {
        await tx.ticket.deleteMany({
          where: { user_id: t.user_id }
        });
      }
      await tx.eventCapacityAllocation.updateMany({
        where: {
          id: ticket[0].allocation_id,
        },        
        data: {
          available_seats: { increment: ticket.length },
        },

      });

      });

    }

    
  }
}


