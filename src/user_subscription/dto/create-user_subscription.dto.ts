import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateUserSubscriptionDto {

    @IsUUID()
    @IsNotEmpty()
    owner_id!: string;

    @IsUUID()
    @IsNotEmpty()
    subscription_plan_id!: string;
}
