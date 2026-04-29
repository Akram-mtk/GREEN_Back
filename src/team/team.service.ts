import { Injectable, BadRequestException, ConflictException, NotFoundException, Inject } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_SERVICE } from '../storage/storage.interface';
import type { IStorageService } from '../storage/storage.interface';
import type { File as MulterFile } from 'multer';

@Injectable()
export class TeamService {

  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
  ) {}

  async create(createTeamDto: CreateTeamDto, file?: MulterFile) {
    if (!file) throw new BadRequestException('Image file is required');

    const imageUrl = await this.storageService.upload(file, 'teams');

    try {
      return await this.prisma.team.create({
        data: {
          name: createTeamDto.name.trim(),
          short_name: createTeamDto.short_name.trim(),
          imageUrl,
        },
      });
    } catch (error: any) {
      await this.storageService.delete(imageUrl);

      if (error.code === 'P2002') {
        const fields = (error.meta?.target as string[]) ?? [];
        if (fields.includes('name')) throw new ConflictException('Team name already exists');
        if (fields.includes('short_name')) throw new ConflictException('Team short name already exists');
        throw new ConflictException('Team already exists');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.team.findMany({ where: { deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.team.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  async remove(id: string) {
    const team = await this.prisma.team.findFirst({ where: { id, deletedAt: null } });
    if (!team) throw new NotFoundException('Team not found');

    await this.storageService.delete(team.imageUrl);

    return this.prisma.team.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
