import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { CreateRfidCardDto } from './dto/create-rfid_card.dto';
import { AssignCardToUserDto, ScanRfidDto, UpdateRfidCardDto } from './dto/update-rfid_card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CardStatus } from '@prisma/client';

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

@Injectable()
export class RfidCardsService {

  constructor(private prisma: PrismaService) {}

  async create(createRfidCardDto: CreateRfidCardDto) {
    const plaintextClaimCode  = randomBytes(5).toString('hex');   // 10 hex chars
    const plaintextCardSecret = randomBytes(32).toString('hex');  // 64 hex chars

    const card = await this.prisma.rfid_cards.create({
      data: {
        card_uid:    createRfidCardDto.card_uid,
        card_secret: sha256(plaintextCardSecret),
        claim_code:  sha256(plaintextClaimCode),
      },
    });

    // Return plaintext values once — admin writes card_secret to card's secure memory
    return { ...card, claim_code: plaintextClaimCode, card_secret: plaintextCardSecret };
  }

  async assign(assignCardToUserDto: AssignCardToUserDto, userId: string) {
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user || !user.is_active) throw new ForbiddenException('Account is disabled');

    const existingCard = await this.prisma.rfid_cards.findFirst({ where: { owner_id: userId } });
    if (existingCard) throw new ConflictException('User already has an RFID card');

    const card = await this.prisma.rfid_cards.findFirst({
      where: { claim_code: sha256(assignCardToUserDto.claim_code), owner_id: null },
    });

    if (!card) throw new NotFoundException('Invalid or already used claim code');

    const updated = await this.prisma.rfid_cards.update({
      where: { id: card.id },
      data: { owner_id: userId, status: CardStatus.active, claim_code: null },
    });

    const { card_secret, claim_code, ...safeCard } = updated;
    return safeCard;
  }

  async blockCard(identifier: string) {
    const card = await this.prisma.rfid_cards.findFirst({
      where: { OR: [{ id: identifier }, { card_uid: identifier }] },
    });

    if (!card) throw new NotFoundException('Card not found');

    return this.prisma.rfid_cards.update({
      where: { id: card.id },
      data: { status: CardStatus.blocked },
    });
  }

  async findOne(userId: string) {
    return await this.prisma.rfid_cards.findFirst({
      where: { owner_id: userId, status: CardStatus.active },
    });
  }

  async scan(scanRfidDto: ScanRfidDto): Promise<{ access: string; method: string }> {
    const card = await this.prisma.rfid_cards.findUnique({
      where: { card_uid: scanRfidDto.card_uid },
    });

    if (!card) throw new NotFoundException('RFID card not found');
    if (card.card_secret !== sha256(scanRfidDto.card_secret)) throw new ForbiddenException('Invalid card secret');
    if (card.status !== CardStatus.active) throw new ForbiddenException('Card is not active');
    if (!card.owner_id) throw new ForbiddenException('Card has no owner');

    const ownerId = card.owner_id;

    const event = await this.prisma.event.findUnique({
      where: { id: scanRfidDto.event_id },
    });
    if (!event) throw new NotFoundException('Event not found');

    const now = new Date();
    if (now < event.open_at || now > event.close_at) {
      throw new ForbiddenException('Event gates are closed');
    }

    const existingEntry = await this.prisma.entryLog.findUnique({
      where: { user_id_event_id: { user_id: ownerId, event_id: scanRfidDto.event_id } },
    });
    if (existingEntry) throw new ConflictException('User already entered this event');

    // Ticket-based entry (adult tickets only — minors are linked via parent_ticket_id)
    const ticket = await this.prisma.ticket.findFirst({
      where: { EventCapacityAllocation: { event_id: scanRfidDto.event_id }, user_id: ownerId, parent_ticket_id: null },
    });

    if (ticket && !ticket.used) {
      await this.prisma.$transaction(async (tx) => {
        await tx.ticket.update({ where: { id: ticket.id }, data: { used: true } });
        // Mark all RFID-order minor tickets linked to this parent ticket as used
        await tx.ticket.updateMany({
          where: { parent_ticket_id: ticket.id, used: false },
          data: { used: true },
        });
        await tx.entryLog.create({ data: { user_id: ownerId, event_id: scanRfidDto.event_id } });
      });
      return { access: 'granted', method: 'ticket' };
    }

    // Subscription-based entry
    const eventAreas = await this.prisma.eventCapacityAllocation.findMany({
      where: { event_id: scanRfidDto.event_id },
      select: { area_id: true },
    });
    const areaIds = eventAreas.map((a) => a.area_id);

    const subscription = await this.prisma.userSubscription.findFirst({
      where: {
        owner_id: ownerId,
        subscription: {
          area_id: { in: areaIds },
          expires_at: { gt: now },
        },
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

    throw new ForbiddenException('No valid ticket or subscription for this event');
  }

  findAll() {
    return `This action returns all rfidCards`;
  }

  update(id: string, updateRfidCardDto: UpdateRfidCardDto) {
    return `This action updates a #${id} rfidCard`;
  }

  remove(id: string) {
    return `This action removes a #${id} rfidCard`;
  }
}