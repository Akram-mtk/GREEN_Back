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


  
  async create(createTicketDto: CreateTicketDto) {

    let ticket = await this.prisma.ticket.findFirst({
      where: { user_id: createTicketDto.user_id ,
               event_id: createTicketDto.event_id
      }
    })

    if(!ticket){
      await this.prisma.$transaction(async (tx) => {
        let available_seat = await tx.eventCapacityAllocation.updateMany({
              where: {
                available_seats:{gt:0}, 
              event_id: createTicketDto.event_id 
            },
              data: {
                available_seats: { decrement: 1 } 
              },
            });
            if(available_seat.count > 0){
              return await tx.ticket.create({
                data: createTicketDto
              }); 
            }else{
              throw new Error('SOLD_OUT: No seats available for this event.');
            }
      });

    }
    else{
      throw new Error('User already has a ticket for this event');  
    }
  }

  async confirmTicket(id: string) {
    return await this.prisma.ticket.update({
      where: { id: id },
      data: { confirmed: true }
    });
  }
     
 

  async findAll() {
    return await this.prisma.ticket.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.ticket.findUnique({
      where: { id: id }
    });
  }

  async update(id: string, updateTicketDto: UpdateTicketDto) {
    return await this.prisma.ticket.update({
      where: { id: id },
      data: updateTicketDto
    });
  }

  async remove(id: string) {
    return await this.prisma.ticket.delete({
      where: { id: id }
    });
  }
}


