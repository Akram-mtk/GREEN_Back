import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscription_plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription_plan.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionPlanService {

  constructor(private prisma: PrismaService){}

  async create(createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return await this.prisma.subscriptionPlan.create({
      data: createSubscriptionPlanDto
    });
  }

  async findAll() {
    return await this.prisma.subscriptionPlan.findMany({
      where: {
        is_active: true
      }
    })
  }

  async findOne(id: string) {
    const respons = await this.prisma.subscriptionPlan.findUnique({
      where: {
        id,
        is_active: true
      }
    });

    if (!respons) {
      throw new NotFoundException(`SubscriptionPlan with ID ${id} not found`);
    }

    return respons;
  }
  
  
  
  
  
  
  update(id: string, updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return `This action updates a #${id} subscriptionPlan`;
  }
  
  
  deactivate(id: string) {
    return this.prisma.subscriptionPlan.update({
      where: { id },
      data : { is_active: false}
    });;
  }

  remove(id: string) {
    return `This action removes a #${id} subscriptionPlan`;
  }
}
