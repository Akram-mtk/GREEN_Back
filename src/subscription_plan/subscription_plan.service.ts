import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscription_plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription_plan.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubscriptionPlanService {

  constructor(private prisma: PrismaService){}

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return await this.prisma.subscriptionPlan.create({
      data: createSubscriptionPlanDto
    });
  }

  async findAll() {
    return await this.prisma.subscriptionPlan.findMany()
  }

  async findOne(id: string) {
    const respons = await this.prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!respons) {
      throw new NotFoundException(`SubscriptionPlan with ID ${id} not found`);
    }

    return respons;
  }






  update(id: number, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return `This action updates a #${id} subscriptionPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscriptionPlan`;
  }
}
