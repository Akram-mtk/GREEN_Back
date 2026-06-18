import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ClubSettingsService } from './club_settings.service';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('club-settings')
export class ClubSettingsController {
  constructor(private readonly service: ClubSettingsService) {}

  @Get()
  get() {
    return this.service.get();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(@Body() dto: UpdateClubSettingsDto) {
    return this.service.update(dto);
  }
}
