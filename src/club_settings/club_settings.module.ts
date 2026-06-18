import { Module } from '@nestjs/common';
import { ClubSettingsService } from './club_settings.service';
import { ClubSettingsController } from './club_settings.controller';

@Module({
  controllers: [ClubSettingsController],
  providers: [ClubSettingsService],
  exports: [ClubSettingsService],
})
export class ClubSettingsModule {}
