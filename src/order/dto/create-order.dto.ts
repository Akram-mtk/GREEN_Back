import {
  IsUUID, IsNotEmpty, IsArray, IsBoolean, IsString,
  IsOptional, IsInt, Min, ArrayMinSize, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAttendeeDto {
  @IsBoolean()
  isMinor!: boolean;

  /** RFID adults only */
  @IsOptional()
  @IsString()
  card_uid?: string;

  /** Name adults + minors */
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  /** Minors only: 0-based index of the supervising adult in the attendees array */
  @IsOptional()
  @IsInt()
  @Min(0)
  parent_index?: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  allocation_id!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAttendeeDto)
  attendees!: CreateAttendeeDto[];
}
