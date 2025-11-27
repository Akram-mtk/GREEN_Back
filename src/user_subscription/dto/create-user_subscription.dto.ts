import {IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserSubscriptionDto {

    @IsString()
    @IsNotEmpty()
    owner_id: string;

    @IsString()
    @IsNotEmpty()
    subscription_plan_id: string;
    
}
