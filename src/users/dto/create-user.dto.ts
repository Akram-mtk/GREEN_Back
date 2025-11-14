import {IsOptional,IsUUID,IsNotEmpty, IsString, MinLength, IsEmail, IsEnum ,IsNumber,Length} from 'class-validator';

export class CreateUserDto {


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
}

function IsUnique(): (target: CreateUserDto, propertyKey: "email") => void {
    throw new Error('Function not implemented.');
}
