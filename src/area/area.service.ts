import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreaService {

  constructor(private prisma: PrismaService){}

  
  create(createAreaDto: CreateAreaDto) {
    return this.prisma.area.create({data: createAreaDto});
  }

  findAll() {
    return this.prisma.area.findMany({ where: { deletedAt: null } });
  }

  findOne(id: string) {
    return this.prisma.area.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, updateAreaDto: UpdateAreaDto) {
    return this.prisma.area.update({
      where: { id },
      data: updateAreaDto
    });
  }

  remove(id: string) {
    return this.prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
