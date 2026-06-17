import { IsOptional, IsNotEmpty, IsString, IsNumber, IsUUID, IsDateString } from 'class-validator';

export class CreateSubscriptionPlanDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsNumber()
    @IsNotEmpty()
    price!: number;

    @IsNumber()
    @IsOptional()
    number_of_entrance?: number | null;

    @IsDateString()
    @IsNotEmpty()
    expires_at!: string;

    @IsNumber()
    @IsNotEmpty()
    validation_time_by_month!: number;

    

}
