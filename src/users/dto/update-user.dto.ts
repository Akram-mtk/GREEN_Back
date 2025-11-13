import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum } from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    first_name: string;

    @IsString()
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password_hash: string;


}