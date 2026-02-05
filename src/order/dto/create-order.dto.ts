import { IsString, IsNumber, IsArray, ValidateNested, IsNotEmpty, isString, IsUUID, isUUID, IsBoolean } from 'class-validator';

export class CreateOrderDto {

    @IsNotEmpty()
    @IsUUID()
    user_id: string;
    
    @IsNotEmpty()
    @IsUUID()
    allocation_id: string;
    
    @IsNotEmpty()
    @IsUUID()
    event_id: string;

    @IsNotEmpty()
    @IsUUID()
    group_id: string;
   
    @IsBoolean()
    @IsNotEmpty()
    isMinor: boolean;
}
