import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { File as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamService {

  constructor(private prisma: PrismaService) {}
  
  async create(createTeamDto: CreateTeamDto, file?: MulterFile) {
    if (!file) {throw new BadRequestException('Image file is required');}

    const uploadDir = path.join(process.cwd(), 'uploads/teams');

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    const filename = `${unique}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    try {
      const team = await this.prisma.team.create({
        data: {
          name: createTeamDto.name.trim(),
          short_name: createTeamDto.short_name.trim(),
          imageUrl: filename,
        },
      });

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(filepath, file.buffer);

      return team;
    } catch (error) {
      // 🔥 UNIQUE constraint failed
      if (error.code === 'P2002') {
        const fields = (error.meta?.target as string[]) ?? [];

        if (fields.includes('name')) {
          throw new ConflictException('Team name already exists');
        }

        if (fields.includes('short_name')) {
          throw new ConflictException('Team short name already exists');
        }

        throw new ConflictException('Team already exists');
      }

      throw error;
    }
  }

  findAll() {
    return this.prisma.team.findMany();
  }

  findOne(id: string) {
    return this.prisma.team.findUnique({
        where: { id: id }
    });
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
