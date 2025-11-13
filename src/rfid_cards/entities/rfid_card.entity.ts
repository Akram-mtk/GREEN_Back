import { RfidCards } from "@prisma/client";

export class RfidCardEntity implements RfidCards{


    constructor(partial: Partial<RfidCards>){
        Object.assign(this,partial);
    }

    id: string;
    user_id: string | null;
    hashed_uid: string;
    status: string;
    issued_at: Date;
    last_used_at: Date | null;

}
