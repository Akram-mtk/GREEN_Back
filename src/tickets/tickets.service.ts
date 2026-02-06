import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';

// utils/sleep.ts or a similar utility file
export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}


  
  async create(createTicketDto: CreateTicketDto, order_id:string) {

    await this.prisma.$transaction(async (tx) => {
      let parent_ticket= await tx.ticket.findFirst({
        where: {
          user_id: createTicketDto.user_id,}});

          if(createTicketDto.isMinor && !parent_ticket){
            throw new Error('You need to buy the accompanying adult ticket first');
          }

      await tx.ticket.create({
        data: createTicketDto
      });

      await tx.order.delete({
        where : {
          id : order_id
        },
      });

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


