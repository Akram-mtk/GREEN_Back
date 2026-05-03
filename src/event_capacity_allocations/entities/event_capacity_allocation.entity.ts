import { Decimal } from '@prisma/client/runtime/library';

export class EventCapacityAllocation {
  id!: string;
  event_id!: string;
  area_id!: string;
  available_seats!: number;
  home_team_area!: boolean;
  price!: Decimal;
}
