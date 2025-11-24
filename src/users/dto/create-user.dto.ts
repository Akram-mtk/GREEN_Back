import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum } from 'class-validator';

export class CreateUserDto {


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
    password: string;


}

function IsUnique(): (target: CreateUserDto, propertyKey: "email") => void {
    throw new Error('Function not implemented.');
}
