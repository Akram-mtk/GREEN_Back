import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRfidCardDto } from './dto/create-rfid_card.dto';
import { AssignCardToUserDto, UpdateRfidCardDto } from './dto/update-rfid_card.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RfidCardsService {
  
  constructor(private prisma: PrismaService){}
  
  
  async create(createRfidCardDto: CreateRfidCardDto) {
    return this.prisma.rfidCards.create({
      data: createRfidCardDto
    })
  }
  
  // NOTE : what if the user have been deleted means card.user_id set to null
  async assign(assignCardToUserDto: AssignCardToUserDto) {
    // Fetch the existing card
    const card = await this.prisma.rfidCards.findUnique({
        where: { id: assignCardToUserDto.rfidCardId },
        select: { user_id: true },
    });

    if (!card) {
        throw new NotFoundException('Card not found');
    }

    // Prevent reassignment
    if (card.user_id !== null) {
        throw new BadRequestException('This card is already assigned to a user');
    }

    return this.prisma.rfidCards.update({
        where: { id: assignCardToUserDto.rfidCardId },
        data: { user_id: assignCardToUserDto.userId },
    });
  }













  findAll() {
    return `This action returns all rfidCards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} rfidCard`;
  }

  

  update(id: number, updateRfidCardDto: UpdateRfidCardDto) {
    return `This action updates a #${id} rfidCard`;
  }

  remove(id: number) {
    return `This action removes a #${id} rfidCard`;
  }
}
