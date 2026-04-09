import { Args, Float, ID, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import {
  AccountGql,
  CategoryGql,
  CreateAccountInput,
  CreateCategoryInput,
  CreateTransactionInput,
  MoneySummaryGql,
  MonthlyIncomePlanGql,
  SetMonthlyIncomePlanInput,
  SetWeeklyExpensePlanInput,
  TransactionGql,
  UpdateAccountInput,
  WeeklyExpensePlanGql,
} from '../graphql/models';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
import { TransactionType } from '@prisma/client';

function toNum(d: { toString(): string }) {
  return Number(d.toString());
}

@Resolver()
export class MoneyResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly kafka: KafkaService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [CategoryGql])
  categories(@CurrentUser() auth: AuthUser) {
    return this.prisma.category.findMany({
      where: { userId: auth.userId },
      orderBy: { name: 'asc' },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CategoryGql)
  createCategory(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateCategoryInput,
  ) {
    return this.prisma.category.create({
      data: {
        name: input.name,
        color: input.color,
        userId: auth.userId,
      },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteCategory(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.category.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [TransactionGql])
  async transactions(
    @CurrentUser() auth: AuthUser,
    @Args('from', { type: () => Date, nullable: true }) from?: Date,
    @Args('to', { type: () => Date, nullable: true }) to?: Date,
  ) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TransactionGql)
  async createTransaction(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateTransactionInput,
  ) {
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
    } catch {
      /* Redis optional */
    }
    await this.kafka.publish({
      type: 'TRANSACTION_CREATED',
      userId: auth.userId,
      payload: { transactionId: t.id, amount: toNum(t.amount), type: t.type },
      at: new Date().toISOString(),
    });
    return { ...t, amount: toNum(t.amount) };
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteTransaction(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.transaction.deleteMany({
      where: { id, userId: auth.userId },
    });
    if (r.count > 0) {
      try {
        await this.redis.delByPrefix(`summary:${auth.userId}:`);
      } catch {
        /* Redis optional */
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

  @UseGuards(GqlAuthGuard)
  @Query(() => MoneySummaryGql)
  async moneySummary(
    @CurrentUser() auth: AuthUser,
    @Args('month', { type: () => Int, nullable: true }) month?: number,
    @Args('year', { type: () => Int, nullable: true }) year?: number,
  ): Promise<MoneySummaryGql> {
    const now = new Date();
    const y = year ?? now.getFullYear();
    const m = month != null ? month - 1 : now.getMonth();
    const periodStart = new Date(y, m, 1);
    const periodEnd = new Date(y, m + 1, 0, 23, 59, 59, 999);
    const cacheKey = `summary:${auth.userId}:${y}-${m + 1}`;
    try {
      const cached = await this.redis.getJson<MoneySummaryGql>(cacheKey);
      if (cached) return cached;
    } catch {
      /* Redis optional */
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
      if (r.type === TransactionType.INCOME) income += n;
      else expense += n;
    }
    const result: MoneySummaryGql = {
      income,
      expense,
      periodStart,
      periodEnd,
    };
    try {
      await this.redis.setJson(cacheKey, result, 60);
    } catch {
      /* Redis optional */
    }
    return result;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [AccountGql])
  async accounts(@CurrentUser() auth: AuthUser): Promise<AccountGql[]> {
    const rows = await this.prisma.account.findMany({
      where: { userId: auth.userId },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    return rows.map((a) => ({ ...a, balance: toNum(a.balance) }));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AccountGql)
  createAccount(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateAccountInput,
  ) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AccountGql)
  async updateAccount(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: UpdateAccountInput,
  ) {
    const cur = await this.prisma.account.findFirst({
      where: { id: input.id, userId: auth.userId },
    });
    if (!cur) throw new NotFoundException();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteAccount(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.account.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [MonthlyIncomePlanGql])
  async monthlyIncomePlans(
    @CurrentUser() auth: AuthUser,
    @Args('year', { type: () => Int }) year: number,
  ): Promise<MonthlyIncomePlanGql[]> {
    const rows = await this.prisma.monthlyIncomePlan.findMany({
      where: { userId: auth.userId, year },
      orderBy: { month: 'asc' },
    });
    return rows.map((r) => ({
      ...r,
      plannedAmount: toNum(r.plannedAmount),
    }));
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => MonthlyIncomePlanGql)
  async setMonthlyIncomePlan(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: SetMonthlyIncomePlanInput,
  ): Promise<MonthlyIncomePlanGql> {
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
      },
      update: { plannedAmount: input.plannedAmount },
    });
    return { ...row, plannedAmount: toNum(row.plannedAmount) };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [WeeklyExpensePlanGql])
  async weeklyExpensePlansForYear(
    @CurrentUser() auth: AuthUser,
    @Args('year', { type: () => Int }) year: number,
  ): Promise<WeeklyExpensePlanGql[]> {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => WeeklyExpensePlanGql)
  async setWeeklyExpensePlan(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: SetWeeklyExpensePlanInput,
  ): Promise<WeeklyExpensePlanGql> {
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
}
