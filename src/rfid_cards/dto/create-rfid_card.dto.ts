import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRfidCardDto {
  @IsString()
  @IsNotEmpty()
  card_uid!: string;
}