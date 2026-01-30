import {IsOptional,IsNotEmpty, IsString, IsEmail, Matches } from 'class-validator';

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


    @IsString()
    @IsOptional()
    @Matches(
    /^0(5|6|7)\d{8}$/,
    { message: 'Phone number must be a valid Algerian mobile number' },
  )
    phone?: string;


}