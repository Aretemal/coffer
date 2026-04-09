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
exports.ListsResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const gql_auth_guard_1 = require("../auth/gql-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const models_1 = require("../graphql/models");
let ListsResolver = class ListsResolver {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async itemLists(auth) {
        const lists = await this.prisma.itemList.findMany({
            where: { userId: auth.userId },
            include: {
                rows: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
            },
            orderBy: { createdAt: 'desc' },
        });
        return lists.map((l) => ({
            id: l.id,
            name: l.name,
            rows: l.rows.map((r) => ({
                id: r.id,
                text: r.text,
                sortOrder: r.sortOrder,
                listId: r.listId,
            })),
        }));
    }
    async createItemList(auth, input) {
        const l = await this.prisma.itemList.create({
            data: { name: input.name.trim(), userId: auth.userId },
            include: { rows: true },
        });
        return { id: l.id, name: l.name, rows: [] };
    }
    async renameItemList(auth, input) {
        const cur = await this.prisma.itemList.findFirst({
            where: { id: input.id, userId: auth.userId },
        });
        if (!cur)
            throw new common_1.NotFoundException();
        const l = await this.prisma.itemList.update({
            where: { id: input.id },
            data: { name: input.name.trim() },
            include: {
                rows: { orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] },
            },
        });
        return {
            id: l.id,
            name: l.name,
            rows: l.rows.map((r) => ({
                id: r.id,
                text: r.text,
                sortOrder: r.sortOrder,
                listId: r.listId,
            })),
        };
    }
    async deleteItemList(auth, id) {
        const r = await this.prisma.itemList.deleteMany({
            where: { id, userId: auth.userId },
        });
        return r.count > 0;
    }
    async addItemListRow(auth, input) {
        const list = await this.prisma.itemList.findFirst({
            where: { id: input.listId, userId: auth.userId },
        });
        if (!list)
            throw new common_1.NotFoundException();
        const max = await this.prisma.itemListRow.aggregate({
            where: { listId: input.listId },
            _max: { sortOrder: true },
        });
        const sortOrder = (max._max.sortOrder ?? -1) + 1;
        const row = await this.prisma.itemListRow.create({
            data: {
                listId: input.listId,
                text: input.text.trim(),
                sortOrder,
            },
        });
        return {
            id: row.id,
            text: row.text,
            sortOrder: row.sortOrder,
            listId: row.listId,
        };
    }
    async deleteItemListRow(auth, id) {
        const row = await this.prisma.itemListRow.findFirst({
            where: { id },
            include: { list: true },
        });
        if (!row || row.list.userId !== auth.userId)
            return false;
        await this.prisma.itemListRow.delete({ where: { id } });
        return true;
    }
};
exports.ListsResolver = ListsResolver;
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Query)(() => [models_1.ItemListGql]),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "itemLists", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.ItemListGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.CreateItemListInput]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "createItemList", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.ItemListGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.RenameItemListInput]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "renameItemList", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "deleteItemList", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => models_1.ItemListRowGql),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, models_1.AddItemListRowInput]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "addItemListRow", null);
__decorate([
    (0, common_1.UseGuards)(gql_auth_guard_1.GqlAuthGuard),
    (0, graphql_1.Mutation)(() => Boolean),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, graphql_1.Args)('id', { type: () => graphql_1.ID })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ListsResolver.prototype, "deleteItemListRow", null);
exports.ListsResolver = ListsResolver = __decorate([
    (0, graphql_1.Resolver)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListsResolver);
//# sourceMappingURL=lists.resolver.js.map