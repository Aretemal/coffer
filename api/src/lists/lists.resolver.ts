import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import {
  AddItemListRowInput,
  CreateItemListInput,
  ItemListGql,
  ItemListRowGql,
  RenameItemListInput,
} from '../graphql/models';

@Resolver()
export class ListsResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [ItemListGql])
  async itemLists(@CurrentUser() auth: AuthUser): Promise<ItemListGql[]> {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ItemListGql)
  async createItemList(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateItemListInput,
  ): Promise<ItemListGql> {
    const l = await this.prisma.itemList.create({
      data: { name: input.name.trim(), userId: auth.userId },
      include: { rows: true },
    });
    return { id: l.id, name: l.name, rows: [] };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ItemListGql)
  async renameItemList(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: RenameItemListInput,
  ): Promise<ItemListGql> {
    const cur = await this.prisma.itemList.findFirst({
      where: { id: input.id, userId: auth.userId },
    });
    if (!cur) throw new NotFoundException();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteItemList(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.itemList.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ItemListRowGql)
  async addItemListRow(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: AddItemListRowInput,
  ): Promise<ItemListRowGql> {
    const list = await this.prisma.itemList.findFirst({
      where: { id: input.listId, userId: auth.userId },
    });
    if (!list) throw new NotFoundException();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteItemListRow(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const row = await this.prisma.itemListRow.findFirst({
      where: { id },
      include: { list: true },
    });
    if (!row || row.list.userId !== auth.userId) return false;
    await this.prisma.itemListRow.delete({ where: { id } });
    return true;
  }
}
