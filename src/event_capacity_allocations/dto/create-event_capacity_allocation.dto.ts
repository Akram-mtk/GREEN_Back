import { IsInt, IsNotEmpty, IsOptional, IsUUID, Min } from 'class-validator';


export class CreateEventCapacityAllocationDto {

    @IsUUID()
    @IsNotEmpty()
    event_id: string;

    @IsUUID()
    @IsNotEmpty()
    area_id: string;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    available_seats: number;

}
