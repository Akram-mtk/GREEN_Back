import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user_subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user_subscription.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserSubscriptionService {

  constructor(private prisma: PrismaService){}
  
  async create(owner_id: string, createUserSubscriptionDto: CreateUserSubscriptionDto) {

    const  subscription_plan_id  = createUserSubscriptionDto.subscription_plan_id;
    const  area_id  = createUserSubscriptionDto.area_id;
    const area = await this.prisma.area.findUnique({ where: { id: area_id } });
    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: subscription_plan_id }
    });
    
    if (!area) throw new NotFoundException("Area not found");
    if (!plan) throw new NotFoundException("Subscription plan not found");
    if (!plan.is_active) throw new BadRequestException("Subscription plan is no longer active");
    
    const expires_at = new Date();
    expires_at.setMonth(expires_at.getMonth() + Math.ceil(plan.validation_time_by_month));

    return this.prisma.userSubscription.create({
      data: {
        owner_id,
        subscription_plan_id,
        entrance_left: plan.number_of_entrance,
        area_id,
        expires_at,
      },
    });
  }

  async findAll(user_id: string) {
    const subscriptions = await this.prisma.userSubscription.findMany({
      where: { owner_id: user_id },
      select: {
        id: true,
        entrance_left: true,
        expires_at: true,
        subscription: {select: {
          name: true,
          number_of_entrance: true ,
          price: true,
        }},
        area: {select: {
          name: true,
        }},
      },
    });

    return subscriptions.map(sub => ({
      ...sub,
      status: sub.expires_at < new Date() ? 'expired' : 'active',
    }));
  }

  findOne(id: string) {
    return `This action returns a #${id} userSubscription`;
  }

  update(id: string, updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return `This action updates a #${id} userSubscription`;
  }

  remove(id: string) {
    return `This action removes a #${id} userSubscription`;
  }
}
