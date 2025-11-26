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
    return await this.prisma.$transaction(async (tx) => {
      //section cretic
      const allocation = await tx.$queryRaw<Array<Record<string, any>>>`SELECT * FROM public."EventCapacityAllocation"
      WHERE id = ${createTicketDto.allocation_id}::uuid 
      FOR UPDATE`;


      if (allocation.length === 0) {
        throw new Error('Allocation not found');
      }
      
      if (allocation[0].available_seats <= 0) {
        throw new Error('No available seats in this allocation');
      }

       await sleep(4000); // Simulate delay for concurrency testing


      await tx.$queryRaw`UPDATE public."EventCapacityAllocation"
      SET available_seats = available_seats - 1 
      WHERE id = ${createTicketDto.allocation_id}::uuid`;

      await tx.ticket.create({
        data: createTicketDto
      });


      //section cretic
    },{
      timeout: 60000, // 10 seconds timeout for the transaction
      maxWait: 60000 // 10 seconds max wait time to acquire locks
    });
    
    }
    throw new Error('User already has a ticket for this event');
     
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


