import { Exclude } from 'class-transformer';

export class SubscriptionPlanEntity {
  constructor(partial: Record<string, any>) {
    Object.assign(this, partial);
  }

  id: string;
  name: string;
  description: string;
  price: any;
  number_of_entrance: number | null;
  expires_at: Date;
  area: any;

  @Exclude()
  area_id: string;

  @Exclude()
  is_active: boolean;
}
