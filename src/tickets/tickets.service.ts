import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {

    let ticket = await this.prisma.ticket.findFirst({
      where: { user_id: createTicketDto.user_id }
    })
    if(!ticket){
    return await this.prisma.ticket.create({
      data: createTicketDto
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
