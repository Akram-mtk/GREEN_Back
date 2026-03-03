import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
constructor(private prisma: PrismaService) {}

 async create(createOrderDto: CreateOrderDto) {
  let max_minors = 5;
    await this.prisma.$transaction(async (tx) => {

  const ticket = await tx.ticket.findFirst({
    where: {
      user_id: createOrderDto.user_id,
      event_id: createOrderDto.event_id
    }
  });

  const order = await tx.order.findFirst({
    where: {
      user_id: createOrderDto.user_id,
      event_id: createOrderDto.event_id
    }
  });

  if ((!ticket && createOrderDto.isMinor) || (!order && createOrderDto.isMinor)) {
    throw new Error('You need to buy the accompanying adult ticket first');
  }

  if ((ticket && !createOrderDto.isMinor) || (order && !createOrderDto.isMinor)) {
    throw new Error('User already has a ticket for this event');
  }

  const available = await tx.eventCapacityAllocation.updateMany({
    where: {
      event_id: createOrderDto.event_id,
      available_seats: { gt: 0 }
    },
    data: {
      available_seats: { decrement: 1 }
    }
  });

  if (available.count === 0) {
    throw new Error('SOLD_OUT: No seats available for this event.');
  }

  return tx.order.create({
    data: createOrderDto
  });
});



      
    
    

  }

  // async findAll() {
  //   return await this.prisma.order.findMany();
  // }

  async findOne(id: string) {
    return await this.prisma.order.findUnique({
      where: { id: id },
    });
  }

  // async update(id: string, updateOrderDto: UpdateOrderDto) {
  //   if(updateOrderDto.user_id){
  //     let userTicket=await this.prisma.ticket.findFirst({
  //       where: { user_id: updateOrderDto.user_id}});
  //       if(userTicket){
  //       throw new Error('User already has a ticket for this event');
  //       }
  //   }else if(updateOrderDto.isMinor){

  //   }
    

  //   return await this.prisma.order.update({
  //     where: { id: id },
  //     data: updateOrderDto,
  //   });
  // }

  async remove(id: string) {
  await this.prisma.$transaction(async (tx) => {

    const order = await tx.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new Error('Order not found');
    }

    let seatsToRestore = 1; // the order itself

    if (!order.isMinor) {
      const minors = await tx.order.findMany({
        where: {
          user_id: order.user_id,
          event_id: order.event_id,
          isMinor: true,
        },
        select: { id: true },
      });

      if (minors.length > 0) {
        seatsToRestore += minors.length;

        await tx.order.deleteMany({
          where: {
            id: { in: minors.map(m => m.id) },
          },
        });
      }
    }

    await tx.eventCapacityAllocation.updateMany({
      where: {
        id: order.allocation_id,
      },
      data: {
        available_seats: { increment: seatsToRestore },
      },
    });

    await tx.order.delete({
      where: { id },
    });
  });
}

}
