import {IsOptional,IsNotEmpty, IsString, IsNumber, IsUUID } from 'class-validator';

export class CreateSubscriptionPlanDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsNumber()
    @IsOptional()
    number_of_entrance: number | null;

    @IsUUID()
    @IsNotEmpty()
    area_id: string;

}
