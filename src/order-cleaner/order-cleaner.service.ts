import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrderCleanerService {

    constructor(private prisma: PrismaService) {}

    @Cron(CronExpression.EVERY_10_HOURS)
    async handleExpiredOrders() {
        const expiredOrders = await this.prisma.order.findMany({
            where: { created_at: { lt: new Date(Date.now() - 10 * 60 * 1000) } },
            select: {
                id: true,
                allocation_id: true,
                _count: { select: { companions: true } },
            },
        });

        if (expiredOrders.length === 0) return;

        // Group by allocation_id; count 1 (buyer) + companions per order
        const allocationCounts = expiredOrders.reduce((acc, order) => {
            acc[order.allocation_id] =
                (acc[order.allocation_id] ?? 0) + 1 + order._count.companions;
            return acc;
        }, {} as Record<string, number>);

        await this.prisma.$transaction([
            this.prisma.order.deleteMany({
                where: { id: { in: expiredOrders.map(o => o.id) } },
            }),
            ...Object.entries(allocationCounts).map(([allocId, count]) =>
                this.prisma.eventCapacityAllocation.update({
                    where: { id: allocId },
                    data: { available_seats: { increment: count } },
                })
            ),
        ]);

        Logger.log(`Deleted ${expiredOrders.length} expired orders`);
    }

}
