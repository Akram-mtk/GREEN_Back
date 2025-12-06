import { Rfid_cards, CardStatus } from "@prisma/client";

export class RfidCardEntity implements Rfid_cards{


    constructor(partial: Partial<Rfid_cards>){
        Object.assign(this,partial);
    }

    id: string;
    owner_id: string | null;
    card_uid: string;
    status: CardStatus;
    created_at: Date;
    updated_at: Date ;

}
