import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { RfidCardsModule } from './rfid_cards/rfid_cards.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, RfidCardsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
