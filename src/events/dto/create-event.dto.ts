import { IsString, IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { TicketType } from '@prisma/client';

export class CreateEventDto {

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsDateString()
    @IsNotEmpty()
    open_at!: Date;

    @IsDateString()
    @IsNotEmpty()
    close_at!: Date;

    @IsDateString()
    @IsNotEmpty()
    start_at!: Date;

    @IsUUID()
    @IsNotEmpty()
    home_team_id!: string;

    @IsUUID()
    @IsNotEmpty()
    away_team_id!: string;

    @IsEnum(TicketType)
    @IsNotEmpty()
    home_ticket_type!: TicketType;

    @IsEnum(TicketType)
    @IsNotEmpty()
    away_ticket_type!: TicketType;

}
