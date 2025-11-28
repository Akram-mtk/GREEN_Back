import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RfidCardsModule } from './rfid_cards/rfid_cards.module';
import { AuthModule } from './auth/auth.module';
import { SubscriptionPlanModule } from './subscription_plan/subscription_plan.module';
import { UserSubscriptionModule } from './user_subscription/user_subscription.module';
import { TeamModule } from './team/team.module';
import { AreaModule } from './area/area.module';

@Module({
  imports: [PrismaModule, UsersModule, RfidCardsModule, AuthModule, SubscriptionPlanModule, UserSubscriptionModule, TeamModule, AreaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
