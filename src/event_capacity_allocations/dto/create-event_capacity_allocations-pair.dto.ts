import { IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventCapacityAllocationDto } from './create-event_capacity_allocation.dto';

export class CreateEventCapacityAllocationsPairDto {
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => CreateEventCapacityAllocationDto)
  allocations!: CreateEventCapacityAllocationDto[];
}
