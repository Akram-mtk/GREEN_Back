import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min, IsBoolean, IsDecimal } from 'class-validator';
import { Type } from 'class-transformer';
import { Decimal } from '@prisma/client/runtime/library';


export class CreateEventCapacityAllocationDto {

    @IsUUID()
    @IsNotEmpty()
    event_id!: string;

    @IsUUID()
    @IsNotEmpty()
    area_id!: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    available_seats!: number;

    @IsBoolean()
    @IsNotEmpty()
    home_team_area!: boolean;

    @IsDecimal({ decimal_digits: '1,2' })
    @IsNotEmpty()
    @Type(() => Decimal)
    price!: Decimal;

}
