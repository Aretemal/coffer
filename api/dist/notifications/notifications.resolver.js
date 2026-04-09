"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const models_1 = require("../graphql/models");
const graphql_enums_1 = require("../common/graphql-enums");
function startOfUtcDay(d) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
function addUtcDays(d, n) {
    const x = new Date(d.getTime());
    x.setUTCDate(x.getUTCDate() + n);
    return x;
}
function utcDayBetween(day, from, to) {
    const t = startOfUtcDay(day).getTime();
    return t >= startOfUtcDay(from).getTime() && t <= startOfUtcDay(to).getTime();
}
let NotificationsResolver = class NotificationsResolver {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buildFiresInRange(userId, from, to) {
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
        const out = [];
        const now = new Date();
        for (const ev of events) {
            if (ev.startsAt <= now)
                continue;
            const eventDay = startOfUtcDay(ev.startsAt);
            if (ev.notifyDayBefore) {
                const fireAt = addUtcDays(eventDay, -1);
                if (utcDayBetween(fireAt, from, to)) {
                    out.push({
                        id: `${ev.id}-DAY_BEFORE`,
                        eventId: ev.id,
                        title: ev.title,
                        eventStartsAt: ev.startsAt,
                        timing: graphql_enums_1.NotificationTiming.DAY_BEFORE,
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
                        timing: graphql_enums_1.NotificationTiming.WEEK_BEFORE,
                        message: `Через неделю событие: «${ev.title}»`,
                        fireAt,
                    });
                }
            }
        }
        out.sort((a, b) => a.fireAt.getTime() - b.fireAt.getTime());
        return out;
    }
    notificationFiresInRange(auth, from, to) {
        return this.buildFiresInRange(auth.userId, from, to);
    }
    todayEventNotifications(auth) {
        const now = new Date();
        const day = startOfUtcDay(now);
        return this.buildFiresInRange(auth.userId, day, day);
    }
};
exports.NotificationsResolver = NotificationsResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.EventNotificationGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('from', { type: () => Date })),
    __param(2, (0, graphql_1.Args)('to', { type: () => Date })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date]),
    __metadata("design:returntype", void 0)
], NotificationsResolver.prototype, "notificationFiresInRange", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.EventNotificationGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsResolver.prototype, "todayEventNotifications", null);
exports.NotificationsResolver = NotificationsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsResolver);
//# sourceMappingURL=notifications.resolver.js.map