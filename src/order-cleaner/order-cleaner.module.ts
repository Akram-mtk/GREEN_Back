import { Module } from '@nestjs/common';
import { OrderCleanerService } from './order-cleaner.service';

@Module({
  providers: [OrderCleanerService]
})
export class OrderCleanerModule {}
