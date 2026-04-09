import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { EventNotificationGql } from '../graphql/models';
export declare class NotificationsResolver {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildFiresInRange;
    notificationFiresInRange(auth: AuthUser, from: Date, to: Date): Promise<EventNotificationGql[]>;
    todayEventNotifications(auth: AuthUser): Promise<EventNotificationGql[]>;
}
