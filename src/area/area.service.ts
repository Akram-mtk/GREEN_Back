import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AreaService {

  constructor(private prisma: PrismaService){}

  
  create(createAreaDto: CreateAreaDto) {
    return this.prisma.area.create({data: createAreaDto});
  }

  findAll() {
    return this.prisma.area.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: string, updateAreaDto: UpdateAreaDto) {
    return this.prisma.area.update({
      where: { id },
      data: updateAreaDto
    });
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }
}
