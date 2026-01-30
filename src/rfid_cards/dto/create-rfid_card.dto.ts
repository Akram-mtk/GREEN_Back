import {IsOptional,IsUUID,IsNotEmpty, IsString } from 'class-validator';


export class CreateRfidCardDto {
    
  @IsOptional()
  @IsUUID()
  owner_id?: string;

  @IsString()
  @IsNotEmpty()
  card_uid: string;

}
