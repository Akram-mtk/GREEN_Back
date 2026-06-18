import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateClubSettingsDto } from './dto/update-club-settings.dto';

@Injectable()
export class ClubSettingsService {
  constructor(private prisma: PrismaService) {}

  async get() {
    const rows = await this.prisma.clubSettings.findMany({ take: 1 });
    if (rows.length > 0) return rows[0];
    return this.prisma.clubSettings.create({ data: {} });
  }

  async update(dto: UpdateClubSettingsDto) {
    const current = await this.get();
    return this.prisma.clubSettings.update({
      where: { id: current.id },
      data: dto,
    });
  }
}
