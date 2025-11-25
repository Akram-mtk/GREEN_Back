import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { IsString, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {

    @IsString()
    @IsOptional() 
    @IsNotEmpty() 
    allocation_id?: string;

    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    confirmed?: boolean;

    @IsBoolean()
    @IsOptional()
    @IsNotEmpty()
    used?: boolean;
}
