import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_SERVICE } from '../storage/storage.interface';
import type { IStorageService } from '../storage/storage.interface';
import type { File as MulterFile } from 'multer';

@Injectable()
export class AdvertisementService {
  constructor(
    private prisma: PrismaService,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
  ) {}

  async create(dto: CreateAdvertisementDto, file?: MulterFile) {
    if (!file) throw new BadRequestException('Image file is required');

    const imageUrl = await this.storageService.upload(file, 'advertisements');

    try {
      return await this.prisma.advertisement.create({
        data: {
          title: dto.title.trim(),
          description: dto.description.trim(),
          link: dto.link.trim(),
          order: dto.order,
          imageUrl,
        },
      });
    } catch (error) {
      await this.storageService.delete(imageUrl);
      throw error;
    }
  }

  findAll() {
    return this.prisma.advertisement.findMany({ orderBy: { order: 'asc' } });
  }

  async findOne(id: string) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');
    return ad;
  }

  async update(id: string, dto: UpdateAdvertisementDto, file?: MulterFile) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');

    let imageUrl = ad.imageUrl;

    if (file) {
      imageUrl = await this.storageService.upload(file, 'advertisements');
    }

    try {
      const updated = await this.prisma.advertisement.update({
        where: { id },
        data: {
          ...(dto.title && { title: dto.title.trim() }),
          ...(dto.description && { description: dto.description.trim() }),
          ...(dto.link && { link: dto.link.trim() }),
          ...(dto.order !== undefined && { order: dto.order }),
          imageUrl,
        },
      });

      if (file) {
        await this.storageService.delete(ad.imageUrl);
      }

      return updated;
    } catch (error) {
      if (file) {
        await this.storageService.delete(imageUrl);
      }
      throw error;
    }
  }

  async remove(id: string) {
    const ad = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!ad) throw new NotFoundException('Advertisement not found');

    await this.storageService.delete(ad.imageUrl);

    return this.prisma.advertisement.delete({ where: { id } });
  }
}
