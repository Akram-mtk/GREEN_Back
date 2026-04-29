import { IsUUID, IsNotEmpty, IsArray, IsBoolean, IsString,
         IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCompanionDto {
  @IsBoolean()
  isMinor: boolean;

  @ValidateIf(o => !o.isMinor)
  @IsNotEmpty()
  @IsUUID()
  user_id?: string;

  @ValidateIf(o => o.isMinor)
  @IsNotEmpty()
  @IsString()
  minor_full_name?: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @IsNotEmpty()
  @IsUUID()
  event_id: string;

  @IsNotEmpty()
  @IsUUID()
  allocation_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCompanionDto)
  companions: CreateCompanionDto[];
}
