import {Users} from '@prisma/client'
import {Exclude } from 'class-transformer'

export class UserEntity implements Users{
    
    constructor(partial: Partial<UserEntity>){
        Object.assign(this,partial);
    }
    
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    
    phone: string | null;
    is_active: boolean;
    created_at: Date;
    // last_login: Date | null;
    // updated_at: Date | null;
    
    @Exclude()
    password: string;
}