import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RfidCardsModule } from './rfid_cards/rfid_cards.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { EventsModule } from './events/events.module';
import { EventCapacityAllocationsModule } from './event_capacity_allocations/event_capacity_allocations.module';
import { SubscriptionPlanModule } from './subscription_plan/subscription_plan.module';
import { UserSubscriptionModule } from './user_subscription/user_subscription.module';
import { TeamModule } from './team/team.module';
import { StorageModule } from './storage/storage.module';
import { AreaModule } from './area/area.module';
import { OrderModule } from './order/order.module';
import { OrderCleanerModule } from './order-cleaner/order-cleaner.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [PrismaModule, StorageModule, UsersModule, RfidCardsModule, AuthModule, SubscriptionPlanModule, UserSubscriptionModule, TeamModule, AreaModule, TicketsModule, EventCapacityAllocationsModule, EventsModule, OrderModule, OrderCleanerModule, AdvertisementModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
