import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderCleanerService {

    constructor(private prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_MINUTE)
    async handleExpiredOrders() {

        let expiredOrders = await this.prisma.order.findMany({
            where: {
                created_at: { lt: new Date(Date.now() - 10 * 60 * 1000) }
            }
        });


        for (let order of expiredOrders) {
             await this.prisma.$transaction(async (tx) => {
                await tx.order.delete({
                    where: { id: order.id }
                });});

            Logger.log(`Deleted expired order with ID: ${order.id}`);

             await this.prisma.eventCapacityAllocation.update({
                where: { id: order.allocation_id },
                data: {
                    available_seats: { increment: 1 }
                }
            })
        }
    }

}
