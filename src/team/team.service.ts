import { Injectable, BadRequestException  } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import type { File as MulterFile } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class TeamService {

  constructor(private prisma: PrismaService) {}
  
  // FIXME : not providing image
  async create(createTeamDto: CreateTeamDto, file?: MulterFile) {
    if (!file) throw new Error('File is required');

    const uploadDir = path.join(process.cwd(), 'uploads/teams');

    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split('.').pop();
    const filename = `${unique}.${ext}`;
    const filepath = path.join(uploadDir, filename);



    const team = await this.prisma.team.create({
      data: {
        name: createTeamDto.name,
        short_name: createTeamDto.short_name,
        imageUrl: `/uploads/teams/${filename}`,
      },
    });

    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(filepath, file.buffer);

    return team;
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
