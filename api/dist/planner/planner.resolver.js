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
exports.PlannerResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const models_1 = require("../graphql/models");
const kafka_service_1 = require("../kafka/kafka.service");
function toNum(d) {
    return Number(d.toString());
}
let PlannerResolver = class PlannerResolver {
    constructor(prisma, kafka) {
        this.prisma = prisma;
        this.kafka = kafka;
    }
    calendarEvents(auth, from, to) {
        return this.prisma.calendarEvent.findMany({
            where: {
                userId: auth.userId,
                startsAt: { gte: from, lte: to },
            },
            orderBy: { startsAt: 'asc' },
        });
    }
    async createCalendarEvent(auth, input) {
        const e = await this.prisma.calendarEvent.create({
            data: {
                title: input.title,
                startsAt: input.startsAt,
                endsAt: input.endsAt,
                allDay: input.allDay,
                notifyDayBefore: input.notifyDayBefore,
                notifyWeekBefore: input.notifyWeekBefore,
                userId: auth.userId,
            },
        });
        await this.kafka.publish({
            type: 'CALENDAR_EVENT_CREATED',
            userId: auth.userId,
            payload: { eventId: e.id },
            at: new Date().toISOString(),
        });
        return e;
    }
    async updateCalendarEvent(auth, input) {
        const cur = await this.prisma.calendarEvent.findFirst({
            where: { id: input.id, userId: auth.userId },
        });
        if (!cur)
            throw new common_1.NotFoundException();
        return this.prisma.calendarEvent.update({
            where: { id: input.id },
            data: {
                ...(input.title != null ? { title: input.title } : {}),
                ...(input.startsAt != null ? { startsAt: input.startsAt } : {}),
                ...(input.endsAt !== undefined ? { endsAt: input.endsAt } : {}),
                ...(input.allDay != null ? { allDay: input.allDay } : {}),
                ...(input.notifyDayBefore != null
                    ? { notifyDayBefore: input.notifyDayBefore }
                    : {}),
                ...(input.notifyWeekBefore != null
                    ? { notifyWeekBefore: input.notifyWeekBefore }
                    : {}),
            },
        });
    }
    async deleteCalendarEvent(auth, id) {
        const r = await this.prisma.calendarEvent.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    reminders(auth) {
        return this.prisma.reminder.findMany({
            where: { userId: auth.userId },
            orderBy: { dueAt: 'asc' },
        });
    }
    async createReminder(auth, input) {
        const r = await this.prisma.reminder.create({
            data: {
                title: input.title,
                dueAt: input.dueAt,
                userId: auth.userId,
            },
        });
        await this.kafka.publish({
            type: 'REMINDER_CREATED',
            userId: auth.userId,
            payload: { reminderId: r.id, dueAt: r.dueAt.toISOString() },
            at: new Date().toISOString(),
        });
        return r;
    }
    toggleReminder(auth, id) {
        return this.prisma.$transaction(async (tx) => {
            const cur = await tx.reminder.findFirst({
                where: { id, userId: auth.userId },
            });
            if (!cur)
                throw new common_1.NotFoundException();
            return tx.reminder.update({
                where: { id },
                data: { completed: !cur.completed },
            });
        });
    }
    async deleteReminder(auth, id) {
        const r = await this.prisma.reminder.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    todos(auth) {
        return this.prisma.todo.findMany({
            where: { userId: auth.userId },
            orderBy: [{ done: 'asc' }, { priority: 'desc' }, { title: 'asc' }],
        });
    }
    createTodo(auth, input) {
        return this.prisma.todo.create({
            data: {
                title: input.title,
                dueAt: input.dueAt,
                priority: input.priority,
                userId: auth.userId,
            },
        });
    }
    toggleTodo(auth, id) {
        return this.prisma.$transaction(async (tx) => {
            const cur = await tx.todo.findFirst({
                where: { id, userId: auth.userId },
            });
            if (!cur)
                throw new common_1.NotFoundException();
            return tx.todo.update({
                where: { id },
                data: { done: !cur.done },
            });
        });
    }
    async deleteTodo(auth, id) {
        const r = await this.prisma.todo.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    async budgetPlans(auth) {
        const plans = await this.prisma.budgetPlan.findMany({
            where: { userId: auth.userId },
            include: { allocations: true },
            orderBy: { startDate: 'desc' },
        });
        return plans.map((p) => ({
            ...p,
            allocations: p.allocations.map((a) => ({
                ...a,
                plannedAmount: toNum(a.plannedAmount),
            })),
        }));
    }
    async createBudgetPlan(auth, input) {
        const p = await this.prisma.budgetPlan.create({
            data: {
                type: input.type,
                startDate: input.startDate,
                endDate: input.endDate,
                description: input.description,
                userId: auth.userId,
                allocations: {
                    create: input.allocations.map((a) => ({
                        plannedAmount: a.plannedAmount,
                        note: a.note,
                        categoryId: a.categoryId,
                    })),
                },
            },
            include: { allocations: true },
        });
        await this.kafka.publish({
            type: 'BUDGET_PLAN_CREATED',
            userId: auth.userId,
            payload: { budgetPlanId: p.id },
            at: new Date().toISOString(),
        });
        return {
            ...p,
            allocations: p.allocations.map((a) => ({
                ...a,
                plannedAmount: toNum(a.plannedAmount),
            })),
        };
    }
    async deleteBudgetPlan(auth, id) {
        const r = await this.prisma.budgetPlan.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
};
exports.PlannerResolver = PlannerResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.CalendarEventGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('from', { type: () => Date })),
    __param(2, (0, graphql_1.Args)('to', { type: () => Date })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "calendarEvents", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.CalendarEventGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateCalendarEventInput]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "createCalendarEvent", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.CalendarEventGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.UpdateCalendarEventInput]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "updateCalendarEvent", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deleteCalendarEvent", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.ReminderGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "reminders", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.ReminderGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateReminderInput]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "createReminder", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.ReminderGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "toggleReminder", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deleteReminder", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.TodoGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "todos", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.TodoGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateTodoInput]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "createTodo", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.TodoGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PlannerResolver.prototype, "toggleTodo", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deleteTodo", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.BudgetPlanGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "budgetPlans", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.BudgetPlanGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateBudgetPlanInput]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "createBudgetPlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deleteBudgetPlan", null);
exports.PlannerResolver = PlannerResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        kafka_service_1.KafkaService])
], PlannerResolver);
//# sourceMappingURL=planner.resolver.js.map