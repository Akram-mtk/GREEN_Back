import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRfidCardDto } from './dto/create-rfid_card.dto';
import { AssignCardToUserDto, ScanRfidDto, UpdateRfidCardDto } from './dto/update-rfid_card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CardStatus } from '@prisma/client';

@Injectable()
export class RfidCardsService {
  
  constructor(private prisma: PrismaService){}
  
  
  async create(createRfidCardDto: CreateRfidCardDto) {
    return this.prisma.rfid_cards.create({
      data: createRfidCardDto
    })
  }
  
  // NOTE : what if the user have been deleted means card.user_id set to null
  async assign(assignCardToUserDto: AssignCardToUserDto) {
    // Fetch the existing card
    const card = await this.prisma.rfid_cards.findUnique({
        where: { id: assignCardToUserDto.rfidCardId },
        select: { owner_id: true },
    });

    if (!card) {
        throw new NotFoundException('Card not found');
    }

    // Prevent reassignment
    if (card.owner_id !== null  ) {
        throw new BadRequestException('This card is already assigned to a user');
    }

    return this.prisma.rfid_cards.update({
        where: { id: assignCardToUserDto.rfidCardId },
        data: { 
          owner_id: assignCardToUserDto.userId,
          status: CardStatus.active
        }
    });
  }



  async blockCard(id: string) {
    return this.prisma.rfid_cards.update({
      where: { id: id },
      data: { status: CardStatus.blocked }
    });
  }


  async findOne(id: string) {
    return await this.prisma.rfid_cards.findFirst({
      where: { owner_id: id, status: CardStatus.active },
    });
  }

  async scan(scanRfidDto: ScanRfidDto): Promise<{ access: string; method: string }> {
    const card = await this.prisma.rfid_cards.findUnique({
      where: { card_uid: scanRfidDto.card_uid },
    });

    if (!card) throw new NotFoundException('RFID card not found');
    if (card.status !== CardStatus.active) throw new ForbiddenException('Card is not active');
    if (!card.owner_id) throw new ForbiddenException('Card has no owner');

    const ownerId = card.owner_id;

    const event = await this.prisma.event.findUnique({
      where: { id: scanRfidDto.event_id },
    });
    if (!event) throw new NotFoundException('Event not found');

    const existingEntry = await this.prisma.entryLog.findUnique({
      where: { user_id_event_id: { user_id: ownerId, event_id: scanRfidDto.event_id } },
    });
    if (existingEntry) throw new ConflictException('User already entered this event');

    // Ticket-based entry
    const ticket = await this.prisma.ticket.findUnique({
      where: { event_id_user_id: { event_id: scanRfidDto.event_id, user_id: ownerId } },
    });

    if (ticket && !ticket.used) {
      await this.prisma.$transaction(async (tx) => {
        await tx.ticket.update({ where: { id: ticket.id }, data: { used: true } });
        await tx.entryLog.create({ data: { user_id: ownerId, event_id: scanRfidDto.event_id } });
      });
      return { access: 'granted', method: 'ticket' };
    }

    // Subscription-based entry (only when event allows any-gate entry)
    if (event.any_gate_entry) {
      const eventAreas = await this.prisma.eventCapacityAllocation.findMany({
        where: { event_id: scanRfidDto.event_id },
        select: { area_id: true },
      });
      const areaIds = eventAreas.map((a) => a.area_id);

      const subscription = await this.prisma.userSubscription.findFirst({
        where: {
          owner_id: ownerId,
          subscription: { area_id: { in: areaIds } },
          OR: [{ entrance_left: null }, { entrance_left: { gt: 0 } }],
        },
      });

      if (subscription) {
        await this.prisma.$transaction(async (tx) => {
          if (subscription.entrance_left !== null) {
            await tx.userSubscription.update({
              where: { id: subscription.id },
              data: { entrance_left: { decrement: 1 } },
            });
          }
          await tx.entryLog.create({ data: { user_id: ownerId, event_id: scanRfidDto.event_id } });
        });
        return { access: 'granted', method: 'subscription' };
      }
    }

    throw new ForbiddenException('No valid ticket or subscription for this event');
  }






  findAll() {
    return `This action returns all rfidCards`;
  }


  

  update(id: number, updateRfidCardDto: UpdateRfidCardDto) {
    return `This action updates a #${id} rfidCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} rfidCard`;
  }
}
