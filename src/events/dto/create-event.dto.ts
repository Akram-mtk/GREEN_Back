import { IsString, IsNotEmpty, IsOptional, IsDateString,IsBoolean, IsUUID } from 'class-validator';

export class CreateEventDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsBoolean()
    @IsNotEmpty()
    any_gate_entry: boolean;

    @IsDateString()
    @IsNotEmpty()
    open_at: Date;

    @IsDateString()
    @IsNotEmpty()
    close_at: Date;

    @IsDateString()
    @IsNotEmpty()
    start_at: Date;

    @IsUUID()
    @IsNotEmpty()
    home_team_id: string;

    @IsUUID()
    @IsNotEmpty()
    away_team_id: string;


}
