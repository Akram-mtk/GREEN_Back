import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum, isString } from 'class-validator';

export class CreateRfidCardDto {

    @IsString()
    @IsNotEmpty()
    card_uid: string;
    
}
