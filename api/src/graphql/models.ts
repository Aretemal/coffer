import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  InputType,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import {
  BudgetPeriodType,
  LearningKind,
  TransactionType,
} from '@prisma/client';
import { NotificationTiming } from '../common/graphql-enums';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

@ObjectType()
export class UserGql {
  @Field(() => ID) id: string;
  @Field() email: string;
  @Field(() => String, { nullable: true }) name?: string | null;
}

@ObjectType()
export class AuthPayload {
  @Field() accessToken: string;
  @Field(() => UserGql) user: UserGql;
}

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  name?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(1)
  password: string;
}

@ObjectType()
export class CategoryGql {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field() color: string;
}

@InputType()
export class CreateCategoryInput {
  @Field() name: string;
  @Field({ defaultValue: '#6366f1' }) color: string;
}

@ObjectType()
export class TransactionGql {
  @Field(() => ID) id: string;
  @Field(() => Float) amount: number;
  @Field(() => TransactionType) type: TransactionType;
  @Field() occurredAt: Date;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field(() => ID, { nullable: true }) categoryId?: string | null;
}

@InputType()
export class CreateTransactionInput {
  @Field(() => Float) amount: number;
  @Field(() => TransactionType) type: TransactionType;
  @Field() occurredAt: Date;
  @Field(() => String, { nullable: true }) note?: string;
  @Field(() => ID, { nullable: true }) categoryId?: string;
}

@ObjectType()
export class MoneySummaryGql {
  @Field(() => Float) income: number;
  @Field(() => Float) expense: number;
  @Field() periodStart: Date;
  @Field() periodEnd: Date;
}

@ObjectType()
export class CalendarEventGql {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() startsAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endsAt?: Date | null;
  @Field() allDay: boolean;
  @Field() notifyDayBefore: boolean;
  @Field() notifyWeekBefore: boolean;
}

@InputType()
export class CreateCalendarEventInput {
  @Field() title: string;
  @Field() startsAt: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endsAt?: Date;
  @Field({ defaultValue: false }) allDay: boolean;
  @Field({ defaultValue: false }) notifyDayBefore: boolean;
  @Field({ defaultValue: false }) notifyWeekBefore: boolean;
}

@InputType()
export class UpdateCalendarEventInput {
  @Field(() => ID) id: string;
  @Field(() => String, { nullable: true }) title?: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) startsAt?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endsAt?: Date;
  @Field(() => Boolean, { nullable: true }) allDay?: boolean;
  @Field(() => Boolean, { nullable: true }) notifyDayBefore?: boolean;
  @Field(() => Boolean, { nullable: true }) notifyWeekBefore?: boolean;
}

@ObjectType()
export class AccountGql {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field(() => Float) balance: number;
  @Field() currency: string;
  @Field(() => Int) sortOrder: number;
}

@InputType()
export class CreateAccountInput {
  @Field() name: string;
  @Field(() => Float) balance: number;
  @Field({ defaultValue: 'RUB' }) currency: string;
}

@InputType()
export class UpdateAccountInput {
  @Field(() => ID) id: string;
  @Field(() => String, { nullable: true }) name?: string;
  @Field(() => Float, { nullable: true }) balance?: number;
  @Field(() => String, { nullable: true }) currency?: string;
  @Field(() => Int, { nullable: true }) sortOrder?: number;
}

@ObjectType()
export class MonthlyIncomePlanGql {
  @Field(() => ID) id: string;
  @Field(() => Int) year: number;
  @Field(() => Int) month: number;
  @Field(() => Float) plannedAmount: number;
}

@InputType()
export class SetMonthlyIncomePlanInput {
  @Field(() => Int) year: number;
  @Field(() => Int) month: number;
  @Field(() => Float) plannedAmount: number;
}

@ObjectType()
export class WeeklyExpensePlanGql {
  @Field(() => ID) id: string;
  @Field() weekStart: Date;
  @Field(() => Float) plannedAmount: number;
  @Field(() => String, { nullable: true }) note?: string | null;
}

@InputType()
export class SetWeeklyExpensePlanInput {
  @Field() weekStart: Date;
  @Field(() => Float) plannedAmount: number;
  @Field(() => String, { nullable: true }) note?: string;
}

@ObjectType()
export class EventNotificationGql {
  @Field(() => ID) id: string;
  @Field(() => ID) eventId: string;
  @Field() title: string;
  @Field() eventStartsAt: Date;
  @Field(() => NotificationTiming) timing: NotificationTiming;
  @Field() message: string;
  @Field() fireAt: Date;
}

@ObjectType()
export class LearningSlotGql {
  @Field(() => ID) id: string;
  @Field() startDate: Date;
  @Field() endDate: Date;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field(() => ID) activityId: string;
}

@ObjectType()
export class LearningActivityGql {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field(() => LearningKind) kind: LearningKind;
  @Field() color: string;
  @Field(() => [LearningSlotGql]) slots: LearningSlotGql[];
}

@InputType()
export class CreateLearningActivityInput {
  @Field() title: string;
  @Field(() => LearningKind, { nullable: true }) kind?: LearningKind;
  @Field(() => String, { nullable: true }) color?: string;
}

@InputType()
export class CreateLearningSlotInput {
  @Field(() => ID) activityId: string;
  @Field() startDate: Date;
  @Field() endDate: Date;
  @Field(() => String, { nullable: true }) note?: string;
}

@InputType()
export class UpdateLearningSlotInput {
  @Field(() => ID) id: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) startDate?: Date;
  @Field(() => GraphQLISODateTime, { nullable: true }) endDate?: Date;
  @Field(() => String, { nullable: true }) note?: string;
}

@ObjectType()
export class ReminderGql {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() dueAt: Date;
  @Field() completed: boolean;
}

@InputType()
export class CreateReminderInput {
  @Field() title: string;
  @Field() dueAt: Date;
}

@ObjectType()
export class TodoGql {
  @Field(() => ID) id: string;
  @Field() title: string;
  @Field() done: boolean;
  @Field(() => GraphQLISODateTime, { nullable: true }) dueAt?: Date | null;
  @Field() priority: number;
}

@InputType()
export class CreateTodoInput {
  @Field() title: string;
  @Field(() => GraphQLISODateTime, { nullable: true }) dueAt?: Date;
  @Field({ defaultValue: 0 }) priority: number;
}

@ObjectType()
export class BudgetAllocationGql {
  @Field(() => ID) id: string;
  @Field(() => Float) plannedAmount: number;
  @Field(() => String, { nullable: true }) note?: string | null;
  @Field(() => ID, { nullable: true }) categoryId?: string | null;
}

@ObjectType()
export class BudgetPlanGql {
  @Field(() => ID) id: string;
  @Field(() => BudgetPeriodType) type: BudgetPeriodType;
  @Field() startDate: Date;
  @Field() endDate: Date;
  @Field(() => String, { nullable: true }) description?: string | null;
  @Field(() => [BudgetAllocationGql]) allocations: BudgetAllocationGql[];
}

@InputType()
export class BudgetAllocationInput {
  @Field(() => Float) plannedAmount: number;
  @Field(() => String, { nullable: true }) note?: string;
  @Field(() => ID, { nullable: true }) categoryId?: string;
}

@InputType()
export class CreateBudgetPlanInput {
  @Field(() => BudgetPeriodType) type: BudgetPeriodType;
  @Field() startDate: Date;
  @Field() endDate: Date;
  @Field(() => String, { nullable: true }) description?: string;
  @Field(() => [BudgetAllocationInput]) allocations: BudgetAllocationInput[];
}

@ObjectType()
export class ItemListRowGql {
  @Field(() => ID) id: string;
  @Field() text: string;
  @Field(() => Int) sortOrder: number;
  @Field(() => ID) listId: string;
}

@ObjectType()
export class ItemListGql {
  @Field(() => ID) id: string;
  @Field() name: string;
  @Field(() => [ItemListRowGql]) rows: ItemListRowGql[];
}

@InputType()
export class CreateItemListInput {
  @Field() name: string;
}

@InputType()
export class RenameItemListInput {
  @Field(() => ID) id: string;
  @Field() name: string;
}

@InputType()
export class AddItemListRowInput {
  @Field(() => ID) listId: string;
  @Field() text: string;
}
