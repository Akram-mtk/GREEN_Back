import { IsOptional, IsString } from 'class-validator';

export class UpdateClubSettingsDto {
  @IsOptional()
  @IsString()
  club_name?: string;

  @IsOptional()
  @IsString()
  club_short_name?: string;

  @IsOptional()
  @IsString()
  stadium_name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsOptional()
  @IsString()
  instagram?: string;
}
