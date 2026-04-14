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
exports.MoneyResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const models_1 = require("../graphql/models");
const redis_service_1 = require("../redis/redis.service");
const kafka_service_1 = require("../kafka/kafka.service");
const client_1 = require("@prisma/client");
function toNum(d) {
    return Number(d.toString());
}
let MoneyResolver = class MoneyResolver {
    constructor(prisma, redis, kafka) {
        this.prisma = prisma;
        this.redis = redis;
        this.kafka = kafka;
    }
    categories(auth) {
        return this.prisma.category.findMany({
            where: { userId: auth.userId },
            orderBy: { name: 'asc' },
        });
    }
    createCategory(auth, input) {
        return this.prisma.category.create({
            data: {
                name: input.name,
                color: input.color,
                userId: auth.userId,
            },
        });
    }
    async deleteCategory(auth, id) {
        const r = await this.prisma.category.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    async transactions(auth, from, to) {
        const rows = await this.prisma.transaction.findMany({
            where: {
                userId: auth.userId,
                ...(from || to
                    ? {
                        occurredAt: {
                            ...(from ? { gte: from } : {}),
                            ...(to ? { lte: to } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { occurredAt: 'desc' },
        });
        return rows.map((t) => ({ ...t, amount: toNum(t.amount) }));
    }
    async createTransaction(auth, input) {
        const t = await this.prisma.transaction.create({
            data: {
                amount: input.amount,
                type: input.type,
                occurredAt: input.occurredAt,
                note: input.note,
                categoryId: input.categoryId,
                userId: auth.userId,
            },
        });
        try {
            await this.redis.delByPrefix(`summary:${auth.userId}:`);
        }
        catch {
        }
        await this.kafka.publish({
            type: 'TRANSACTION_CREATED',
            userId: auth.userId,
            payload: { transactionId: t.id, amount: toNum(t.amount), type: t.type },
            at: new Date().toISOString(),
        });
        return { ...t, amount: toNum(t.amount) };
    }
    async deleteTransaction(auth, id) {
        const r = await this.prisma.transaction.deleteMany({
            where: { id, userId: auth.userId },
        });
        if (r.count > 0) {
            try {
                await this.redis.delByPrefix(`summary:${auth.userId}:`);
            }
            catch {
            }
            await this.kafka.publish({
                type: 'TRANSACTION_DELETED',
                userId: auth.userId,
                payload: { transactionId: id },
                at: new Date().toISOString(),
            });
        }
        return r.count > 0;
    }
    async moneySummary(auth, month, year) {
        const now = new Date();
        const y = year ?? now.getFullYear();
        const m = month != null ? month - 1 : now.getMonth();
        const periodStart = new Date(y, m, 1);
        const periodEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
        const cacheKey = `summary:${auth.userId}:${y}-${m + 1}`;
        try {
            const cached = await this.redis.getJson(cacheKey);
            if (cached)
                return cached;
        }
        catch {
        }
        const rows = await this.prisma.transaction.findMany({
            where: {
                userId: auth.userId,
                occurredAt: { gte: periodStart, lte: periodEnd },
            },
            select: { amount: true, type: true },
        });
        let income = 0;
        let expense = 0;
        for (const r of rows) {
            const n = toNum(r.amount);
            if (r.type === client_1.TransactionType.INCOME)
                income += n;
            else
                expense += n;
        }
        const result = {
            income,
            expense,
            periodStart,
            periodEnd,
        };
        try {
            await this.redis.setJson(cacheKey, result, 60);
        }
        catch {
        }
        return result;
    }
    async accounts(auth) {
        const rows = await this.prisma.account.findMany({
            where: { userId: auth.userId },
            orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        });
        return rows.map((a) => ({ ...a, balance: toNum(a.balance) }));
    }
    createAccount(auth, input) {
        return this.prisma.account
            .create({
            data: {
                name: input.name,
                balance: input.balance,
                currency: input.currency,
                userId: auth.userId,
            },
        })
            .then((a) => ({ ...a, balance: toNum(a.balance) }));
    }
    async updateAccount(auth, input) {
        const cur = await this.prisma.account.findFirst({
            where: { id: input.id, userId: auth.userId },
        });
        if (!cur)
            throw new common_1.NotFoundException();
        const a = await this.prisma.account.update({
            where: { id: input.id },
            data: {
                ...(input.name != null ? { name: input.name } : {}),
                ...(input.balance != null ? { balance: input.balance } : {}),
                ...(input.currency != null ? { currency: input.currency } : {}),
                ...(input.sortOrder != null ? { sortOrder: input.sortOrder } : {}),
            },
        });
        return { ...a, balance: toNum(a.balance) };
    }
    async deleteAccount(auth, id) {
        const r = await this.prisma.account.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    async monthlyIncomePlans(auth, year) {
        const rows = await this.prisma.monthlyIncomePlan.findMany({
            where: { userId: auth.userId, year },
            orderBy: { month: 'asc' },
        });
        return rows.map((r) => ({
            ...r,
            plannedAmount: toNum(r.plannedAmount),
        }));
    }
    async setMonthlyIncomePlan(auth, input) {
        const row = await this.prisma.monthlyIncomePlan.upsert({
            where: {
                userId_year_month: {
                    userId: auth.userId,
                    year: input.year,
                    month: input.month,
                },
            },
            create: {
                userId: auth.userId,
                year: input.year,
                month: input.month,
                plannedAmount: input.plannedAmount,
                description: input.description,
            },
            update: {
                plannedAmount: input.plannedAmount,
                ...(input.description !== undefined ? { description: input.description } : {}),
            },
        });
        return { ...row, plannedAmount: toNum(row.plannedAmount) };
    }
    async weeklyExpensePlansForYear(auth, year) {
        const start = new Date(Date.UTC(year, 0, 1));
        const end = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));
        const rows = await this.prisma.weeklyExpensePlan.findMany({
            where: {
                userId: auth.userId,
                weekStart: { gte: start, lte: end },
            },
            orderBy: { weekStart: 'asc' },
        });
        return rows.map((r) => ({
            ...r,
            plannedAmount: toNum(r.plannedAmount),
        }));
    }
    async setWeeklyExpensePlan(auth, input) {
        const ws = new Date(input.weekStart);
        ws.setUTCHours(0, 0, 0, 0);
        const row = await this.prisma.weeklyExpensePlan.upsert({
            where: {
                userId_weekStart: {
                    userId: auth.userId,
                    weekStart: ws,
                },
            },
            create: {
                userId: auth.userId,
                weekStart: ws,
                plannedAmount: input.plannedAmount,
                note: input.note,
            },
            update: {
                plannedAmount: input.plannedAmount,
                note: input.note,
            },
        });
        return { ...row, plannedAmount: toNum(row.plannedAmount) };
    }
};
exports.MoneyResolver = MoneyResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.CategoryGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MoneyResolver.prototype, "categories", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.CategoryGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateCategoryInput]),
    __metadata("design:returntype", void 0)
], MoneyResolver.prototype, "createCategory", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "deleteCategory", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.TransactionGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('from', { type: () => Date, nullable: true })),
    __param(2, (0, graphql_1.Args)('to', { type: () => Date, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "transactions", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.TransactionGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateTransactionInput]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "createTransaction", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "deleteTransaction", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => models_1.MoneySummaryGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('month', { type: () => graphql_1.Int, nullable: true })),
    __param(2, (0, graphql_1.Args)('year', { type: () => graphql_1.Int, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "moneySummary", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.AccountGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "accounts", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.AccountGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateAccountInput]),
    __metadata("design:returntype", void 0)
], MoneyResolver.prototype, "createAccount", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.AccountGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.UpdateAccountInput]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "updateAccount", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "deleteAccount", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.MonthlyIncomePlanGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('year', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "monthlyIncomePlans", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.MonthlyIncomePlanGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.SetMonthlyIncomePlanInput]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "setMonthlyIncomePlan", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.WeeklyExpensePlanGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('year', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "weeklyExpensePlansForYear", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.WeeklyExpensePlanGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.SetWeeklyExpensePlanInput]),
    __metadata("design:returntype", Promise)
], MoneyResolver.prototype, "setWeeklyExpensePlan", null);
exports.MoneyResolver = MoneyResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        redis_service_1.RedisService,
        kafka_service_1.KafkaService])
], MoneyResolver);
//# sourceMappingURL=money.resolver.js.map