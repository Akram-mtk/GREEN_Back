import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('create/:order_id')
  create(@Param('order_id') order_id: string) {
    return this.ticketsService.create(order_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  findMine(@Req() req: any) {
    return this.ticketsService.findMine(req.user.userId);
  }

  // @Get(':id')
  // findOne(
  //   @Param('id') id: string 
  // ) {
  //   return this.ticketsService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  // @Patch('confirm/:id')
  // confirmTicket(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.ticketsService.confirmTicket(id);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(id);
  }
}
