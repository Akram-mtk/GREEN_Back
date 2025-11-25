import { IsString, IsNotEmpty , IsBoolean} from 'class-validator';


export class CreateTicketDto {

    @IsString()
    @IsNotEmpty()
    allocation_id: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;

    @IsString()
    @IsNotEmpty()
    event_id: string;



}
