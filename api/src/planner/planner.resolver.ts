import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import {
  BudgetPlanGql,
  CalendarEventGql,
  CreateBudgetPlanInput,
  CreateCalendarEventInput,
  CreateReminderInput,
  CreateTodoInput,
  ReminderGql,
  TodoGql,
  UpdateCalendarEventInput,
} from '../graphql/models';
import { KafkaService } from '../kafka/kafka.service';

function toNum(d: { toString(): string }) {
  return Number(d.toString());
}

@Resolver()
export class PlannerResolver {
  constructor(
    private readonly prisma: PrismaService,
    private readonly kafka: KafkaService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [CalendarEventGql])
  calendarEvents(
    @CurrentUser() auth: AuthUser,
    @Args('from', { type: () => Date }) from: Date,
    @Args('to', { type: () => Date }) to: Date,
  ) {
    return this.prisma.calendarEvent.findMany({
      where: {
        userId: auth.userId,
        startsAt: { gte: from, lte: to },
      },
      orderBy: { startsAt: 'asc' },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CalendarEventGql)
  async createCalendarEvent(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateCalendarEventInput,
  ) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CalendarEventGql)
  async updateCalendarEvent(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: UpdateCalendarEventInput,
  ) {
    const cur = await this.prisma.calendarEvent.findFirst({
      where: { id: input.id, userId: auth.userId },
    });
    if (!cur) throw new NotFoundException();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteCalendarEvent(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.calendarEvent.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ReminderGql])
  reminders(@CurrentUser() auth: AuthUser) {
    return this.prisma.reminder.findMany({
      where: { userId: auth.userId },
      orderBy: { dueAt: 'asc' },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReminderGql)
  async createReminder(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateReminderInput,
  ) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ReminderGql)
  toggleReminder(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const cur = await tx.reminder.findFirst({
        where: { id, userId: auth.userId },
      });
      if (!cur) throw new NotFoundException();
      return tx.reminder.update({
        where: { id },
        data: { completed: !cur.completed },
      });
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteReminder(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.reminder.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [TodoGql])
  todos(@CurrentUser() auth: AuthUser) {
    return this.prisma.todo.findMany({
      where: { userId: auth.userId },
      orderBy: [{ done: 'asc' }, { priority: 'desc' }, { title: 'asc' }],
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoGql)
  createTodo(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateTodoInput,
  ) {
    return this.prisma.todo.create({
      data: {
        title: input.title,
        dueAt: input.dueAt,
        priority: input.priority,
        userId: auth.userId,
      },
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TodoGql)
  toggleTodo(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const cur = await tx.todo.findFirst({
        where: { id, userId: auth.userId },
      });
      if (!cur) throw new NotFoundException();
      return tx.todo.update({
        where: { id },
        data: { done: !cur.done },
      });
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteTodo(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.todo.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [BudgetPlanGql])
  async budgetPlans(@CurrentUser() auth: AuthUser) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => BudgetPlanGql)
  async createBudgetPlan(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateBudgetPlanInput,
  ) {
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteBudgetPlan(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.budgetPlan.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }
}
