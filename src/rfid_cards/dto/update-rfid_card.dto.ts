import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum, isString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateRfidCardDto } from './create-rfid_card.dto';

export class UpdateRfidCardDto extends PartialType(CreateRfidCardDto) {


}


export class AssignCardToUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  rfidCardId: string;
}