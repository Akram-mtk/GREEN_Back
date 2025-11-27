import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserSubscriptionDto } from './dto/create-user_subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user_subscription.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserSubscriptionService {

  constructor(private prisma: PrismaService){}
  
  async create(createUserSubscriptionDto: CreateUserSubscriptionDto) {
    
    const { owner_id, subscription_plan_id } = createUserSubscriptionDto;

    const plan = await this.prisma.subscriptionPlan.findUnique({
      where: { id: subscription_plan_id }
    });

    if (!plan) {
      throw new NotFoundException("Subscription plan not found");
    }

    return this.prisma.userSubscription.create({
      data: {
        owner_id,
        subscription_plan_id,
        entrance_left: plan.number_of_entrance
      },
    });
  }

  findAll(user_id: string) {
    return this.prisma.userSubscription.findMany({
      where: {
        owner_id: user_id
    }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} userSubscription`;
  }

  update(id: number, updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
    return `This action updates a #${id} userSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSubscription`;
  }
}
