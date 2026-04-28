import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRfidCardDto } from './create-rfid_card.dto';
import { CardStatus } from '@prisma/client';

export class UpdateRfidCardDto extends PartialType(CreateRfidCardDto) {
  @IsEnum(CardStatus)
  status!: CardStatus;
}

export class AssignCardToUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;

  @IsUUID()
  @IsNotEmpty()
  rfidCardId!: string;
}

export class ScanRfidDto {
  @IsString()
  @IsNotEmpty()
  card_uid!: string;

  @IsUUID()
  @IsNotEmpty()
  event_id!: string;
}