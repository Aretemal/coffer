import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { LearningKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import {
  CreateLearningActivityInput,
  CreateLearningSlotInput,
  LearningActivityGql,
  LearningSlotGql,
  UpdateLearningSlotInput,
} from '../graphql/models';

@Resolver()
export class LearningResolver {
  constructor(private readonly prisma: PrismaService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [LearningActivityGql])
  async learningActivities(
    @CurrentUser() auth: AuthUser,
    @Args('from', { type: () => Date, nullable: true }) from?: Date,
    @Args('to', { type: () => Date, nullable: true }) to?: Date,
  ): Promise<LearningActivityGql[]> {
    const activities = await this.prisma.learningActivity.findMany({
      where: { userId: auth.userId },
      include: {
        slots: {
          where:
            from && to
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LearningActivityGql)
  async createLearningActivity(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateLearningActivityInput,
  ): Promise<LearningActivityGql> {
    const a = await this.prisma.learningActivity.create({
      data: {
        title: input.title,
        kind: input.kind ?? LearningKind.OTHER,
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteLearningActivity(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
    const r = await this.prisma.learningActivity.deleteMany({
      where: { id, userId: auth.userId },
    });
    return r.count > 0;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LearningSlotGql)
  async createLearningSlot(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: CreateLearningSlotInput,
  ): Promise<LearningSlotGql> {
    const act = await this.prisma.learningActivity.findFirst({
      where: { id: input.activityId, userId: auth.userId },
    });
    if (!act) throw new NotFoundException();
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LearningSlotGql)
  async updateLearningSlot(
    @CurrentUser() auth: AuthUser,
    @Args('input') input: UpdateLearningSlotInput,
  ): Promise<LearningSlotGql> {
    const existing = await this.prisma.learningSlot.findFirst({
      where: { id: input.id },
      include: { activity: true },
    });
    if (!existing || existing.activity.userId !== auth.userId) {
      throw new NotFoundException();
    }
    const start = input.startDate ?? existing.startDate;
    const end = input.endDate ?? existing.endDate;
    if (end < start) throw new Error('endDate must be >= startDate');
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

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteLearningSlot(
    @CurrentUser() auth: AuthUser,
    @Args('id', { type: () => ID }) id: string,
  ) {
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
}
