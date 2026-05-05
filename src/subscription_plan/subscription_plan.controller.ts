import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubscriptionPlanService } from './subscription_plan.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription_plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription_plan.dto';
import { SubscriptionPlanEntity } from './entities/subscription_plan.entity';

@Controller('subscription-plan')
export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService) {}

  @Post()
  create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  async findAll() {
    const plans = await this.subscriptionPlanService.findAll();
    return plans.map(p => new SubscriptionPlanEntity(p));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return new SubscriptionPlanEntity(await this.subscriptionPlanService.findOne(id));
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.subscriptionPlanService.deactivate(id);
  }









  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
  //   return this.subscriptionPlanService.update(+id, updateSubscriptionPlanDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subscriptionPlanService.remove(id);
  // }
}
