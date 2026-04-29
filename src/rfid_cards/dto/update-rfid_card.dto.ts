import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRfidCardDto } from './create-rfid_card.dto';
import { CardStatus } from '@prisma/client';

export class UpdateRfidCardDto extends PartialType(CreateRfidCardDto) {
  @IsEnum(CardStatus)
  status!: CardStatus;
}

export class AssignCardToUserDto {
  @IsString()
  @IsNotEmpty()
  claim_code!: string;
}

export class ScanRfidDto {
  @IsString()
  @IsNotEmpty()
  card_uid!: string;

  @IsString()
  @IsNotEmpty()
  card_secret!: string;

  @IsUUID()
  @IsNotEmpty()
  event_id!: string;
}