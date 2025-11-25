import { PartialType } from '@nestjs/mapped-types';
import { CreateEventCapacityAllocationDto } from './create-event_capacity_allocation.dto';

export class UpdateEventCapacityAllocationDto extends PartialType(CreateEventCapacityAllocationDto) {}
