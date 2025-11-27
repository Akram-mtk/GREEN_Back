import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UserSubscriptionService } from './user_subscription.service';
import { CreateUserSubscriptionDto } from './dto/create-user_subscription.dto';
import { UpdateUserSubscriptionDto } from './dto/update-user_subscription.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user-subscription')
export class UserSubscriptionController {

  constructor(private readonly userSubscriptionService: UserSubscriptionService) {}

  @Post()
  create(@Body() createUserSubscriptionDto: CreateUserSubscriptionDto) {
    return this.userSubscriptionService.create(createUserSubscriptionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req: any) {
    const user_id = req.user.userId;
    return this.userSubscriptionService.findAll(user_id);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userSubscriptionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserSubscriptionDto: UpdateUserSubscriptionDto) {
  //   return this.userSubscriptionService.update(+id, updateUserSubscriptionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userSubscriptionService.remove(+id);
  // }
}
