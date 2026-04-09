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
exports.LearningResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const models_1 = require("../graphql/models");
let LearningResolver = class LearningResolver {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async learningActivities(auth, from, to) {
        const activities = await this.prisma.learningActivity.findMany({
            where: { userId: auth.userId },
            include: {
                slots: {
                    where: from && to
                        ? {
                            AND: [
                                { startDate: { lte: to } },
                                { endDate: { gte: from } },
                            ],
                        }
                        : undefined,
                    orderBy: { startDate: 'asc' },
                },
            },
            orderBy: { title: 'asc' },
        });
        return activities.map((a) => ({
            id: a.id,
            title: a.title,
            kind: a.kind,
            color: a.color,
            slots: a.slots.map((s) => ({
                id: s.id,
                startDate: s.startDate,
                endDate: s.endDate,
                note: s.note,
                activityId: s.activityId,
            })),
        }));
    }
    async createLearningActivity(auth, input) {
        const a = await this.prisma.learningActivity.create({
            data: {
                title: input.title,
                kind: input.kind ?? client_1.LearningKind.OTHER,
                color: input.color ?? '#a78bfa',
                userId: auth.userId,
            },
            include: { slots: true },
        });
        return {
            id: a.id,
            title: a.title,
            kind: a.kind,
            color: a.color,
            slots: [],
        };
    }
    async deleteLearningActivity(auth, id) {
        const r = await this.prisma.learningActivity.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    async createLearningSlot(auth, input) {
        const act = await this.prisma.learningActivity.findFirst({
            where: { id: input.activityId, userId: auth.userId },
        });
        if (!act)
            throw new common_1.NotFoundException();
        if (input.endDate < input.startDate) {
            throw new Error('endDate must be >= startDate');
        }
        const s = await this.prisma.learningSlot.create({
            data: {
                activityId: input.activityId,
                startDate: input.startDate,
                endDate: input.endDate,
                note: input.note,
            },
        });
        return {
            id: s.id,
            startDate: s.startDate,
            endDate: s.endDate,
            note: s.note,
            activityId: s.activityId,
        };
    }
    async updateLearningSlot(auth, input) {
        const existing = await this.prisma.learningSlot.findFirst({
            where: { id: input.id },
            include: { activity: true },
        });
        if (!existing || existing.activity.userId !== auth.userId) {
            throw new common_1.NotFoundException();
        }
        const start = input.startDate ?? existing.startDate;
        const end = input.endDate ?? existing.endDate;
        if (end < start)
            throw new Error('endDate must be >= startDate');
        const s = await this.prisma.learningSlot.update({
            where: { id: input.id },
            data: {
                startDate: input.startDate,
                endDate: input.endDate,
                note: input.note,
            },
        });
        return {
            id: s.id,
            startDate: s.startDate,
            endDate: s.endDate,
            note: s.note,
            activityId: s.activityId,
        };
    }
    async deleteLearningSlot(auth, id) {
        const existing = await this.prisma.learningSlot.findFirst({
            where: { id },
            include: { activity: true },
        });
        if (!existing || existing.activity.userId !== auth.userId) {
            return false;
        }
        await this.prisma.learningSlot.delete({ where: { id } });
        return true;
    }
};
exports.LearningResolver = LearningResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.LearningActivityGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('from', { type: () => Date, nullable: true })),
    __param(2, (0, graphql_1.Args)('to', { type: () => Date, nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Date,
        Date]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "learningActivities", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.LearningActivityGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateLearningActivityInput]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "createLearningActivity", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "deleteLearningActivity", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.LearningSlotGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateLearningSlotInput]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "createLearningSlot", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.LearningSlotGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.UpdateLearningSlotInput]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "updateLearningSlot", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LearningResolver.prototype, "deleteLearningSlot", null);
exports.LearningResolver = LearningResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LearningResolver);
//# sourceMappingURL=learning.resolver.js.map