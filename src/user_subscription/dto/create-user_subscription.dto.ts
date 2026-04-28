import { IsDateString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateUserSubscriptionDto {

    @IsUUID()
    @IsNotEmpty()
    owner_id!: string;

    @IsUUID()
    @IsNotEmpty()
    subscription_plan_id!: string;

    @IsOptional()
    @IsDateString()
    expires_at?: string;
}
