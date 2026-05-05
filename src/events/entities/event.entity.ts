import { Exclude } from 'class-transformer';

export class EventEntity {
  constructor(partial: Partial<EventEntity>) {
    Object.assign(this, partial);
  }

  id!: string;
  name!: string;
  open_at!: Date;
  close_at!: Date;
  start_at!: Date;
  home_team_id!: string;
  away_team_id!: string;
  home_team?: any;
  away_team?: any;
  home_ticket_type!: string;
  away_ticket_type!: string;

  @Exclude()
  published!: boolean;

  @Exclude()
  deletedAt?: Date | null;
}
