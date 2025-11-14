import {IsOptional,IsUUID,IsNotEmpty, IsString, Length,MinLength, IsEmail, IsEnum ,IsNumber,IsBoolean} from 'class-validator';

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    
    @IsNumber()
    @Length(10,10)
    phone: number;

    @IsString()
    @IsNotEmpty()
    password_hash: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    



}