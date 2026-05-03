export class Event {
  id!: string;
  name!: string;
  open_at!: Date;
  close_at!: Date;
  start_at!: Date;
  home_team_id!: string;
  away_team_id!: string;
  published!: boolean;
  deletedAt?: Date | null;
}
