import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum, isString } from 'class-validator';

export class CreateRfidCardDto {

    @IsString()
    @IsNotEmpty()
    hashed_uid: string;
    
}
