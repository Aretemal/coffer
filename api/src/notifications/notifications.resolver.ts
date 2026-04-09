import { Args, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { EventNotificationGql } from '../graphql/models';
import { NotificationTiming } from '../common/graphql-enums';

function startOfUtcDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()),
  );
}

function addUtcDays(d: Date, n: number): Date {
  const x = new Date(d.getTime());
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

function utcDayBetween(day: Date, from: Date, to: Date): boolean {
  const t = startOfUtcDay(day).getTime();
  return t >= startOfUtcDay(from).getTime() && t <= startOfUtcDay(to).getTime();
}

@Resolver()
export class NotificationsResolver {
  constructor(private readonly prisma: PrismaService) {}

  private async buildFiresInRange(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<EventNotificationGql[]> {
    const fromBuf = new Date(from);
    fromBuf.setUTCDate(fromBuf.getUTCDate() - 8);
    const toBuf = new Date(to);
    toBuf.setUTCDate(toBuf.getUTCDate() + 2);

    const events = await this.prisma.calendarEvent.findMany({
      where: {
        userId,
        startsAt: { gte: fromBuf, lte: toBuf },
      },
    });

    const out: EventNotificationGql[] = [];
    const now = new Date();

    for (const ev of events) {
      if (ev.startsAt <= now) continue;
      const eventDay = startOfUtcDay(ev.startsAt);

      if (ev.notifyDayBefore) {
        const fireAt = addUtcDays(eventDay, -1);
        if (utcDayBetween(fireAt, from, to)) {
          out.push({
            id: `${ev.id}-DAY_BEFORE`,
            eventId: ev.id,
            title: ev.title,
            eventStartsAt: ev.startsAt,
            timing: NotificationTiming.DAY_BEFORE,
            message: `Завтра событие: «${ev.title}»`,
            fireAt,
          });
        }
      }
      if (ev.notifyWeekBefore) {
        const fireAt = addUtcDays(eventDay, -7);
        if (utcDayBetween(fireAt, from, to)) {
          out.push({
            id: `${ev.id}-WEEK_BEFORE`,
            eventId: ev.id,
            title: ev.title,
            eventStartsAt: ev.startsAt,
            timing: NotificationTiming.WEEK_BEFORE,
            message: `Через неделю событие: «${ev.title}»`,
            fireAt,
          });
        }
      }
    }

    out.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
    return out;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [EventNotificationGql])
  notificationFiresInRange(
    @CurrentUser() auth: AuthUser,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ) {
    return this.buildFiresInRange(auth.userId, from, to);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [EventNotificationGql])
  todayEventNotifications(@CurrentUser() auth: AuthUser) {
    const now = new Date();
    const day = startOfUtcDay(now);
    return this.buildFiresInRange(auth.userId, day, day);
  }
}
