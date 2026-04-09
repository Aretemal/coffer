import { BudgetPeriodType, LearningKind, TransactionType } from '@prisma/client';
import { NotificationTiming } from '../common/graphql-enums';
export declare class UserGql {
    id: string;
    email: string;
    name?: string | null;
}
export declare class AuthPayload {
    accessToken: string;
    user: UserGql;
}
export declare class RegisterInput {
    email: string;
    password: string;
    name?: string;
}
export declare class LoginInput {
    email: string;
    password: string;
}
export declare class CategoryGql {
    id: string;
    name: string;
    color: string;
}
export declare class CreateCategoryInput {
    name: string;
    color: string;
}
export declare class TransactionGql {
    id: string;
    amount: number;
    type: TransactionType;
    occurredAt: Date;
    note?: string | null;
    categoryId?: string | null;
}
export declare class CreateTransactionInput {
    amount: number;
    type: TransactionType;
    occurredAt: Date;
    note?: string;
    categoryId?: string;
}
export declare class MoneySummaryGql {
    income: number;
    expense: number;
    periodStart: Date;
    periodEnd: Date;
}
export declare class CalendarEventGql {
    id: string;
    title: string;
    startsAt: Date;
    endsAt?: Date | null;
    allDay: boolean;
    notifyDayBefore: boolean;
    notifyWeekBefore: boolean;
}
export declare class CreateCalendarEventInput {
    title: string;
    startsAt: Date;
    endsAt?: Date;
    allDay: boolean;
    notifyDayBefore: boolean;
    notifyWeekBefore: boolean;
}
export declare class UpdateCalendarEventInput {
    id: string;
    title?: string;
    startsAt?: Date;
    endsAt?: Date;
    allDay?: boolean;
    notifyDayBefore?: boolean;
    notifyWeekBefore?: boolean;
}
export declare class AccountGql {
    id: string;
    name: string;
    balance: number;
    currency: string;
    sortOrder: number;
}
export declare class CreateAccountInput {
    name: string;
    balance: number;
    currency: string;
}
export declare class UpdateAccountInput {
    id: string;
    name?: string;
    balance?: number;
    currency?: string;
    sortOrder?: number;
}
export declare class MonthlyIncomePlanGql {
    id: string;
    year: number;
    month: number;
    plannedAmount: number;
}
export declare class SetMonthlyIncomePlanInput {
    year: number;
    month: number;
    plannedAmount: number;
}
export declare class WeeklyExpensePlanGql {
    id: string;
    weekStart: Date;
    plannedAmount: number;
    note?: string | null;
}
export declare class SetWeeklyExpensePlanInput {
    weekStart: Date;
    plannedAmount: number;
    note?: string;
}
export declare class EventNotificationGql {
    id: string;
    eventId: string;
    title: string;
    eventStartsAt: Date;
    timing: NotificationTiming;
    message: string;
    fireAt: Date;
}
export declare class LearningSlotGql {
    id: string;
    startDate: Date;
    endDate: Date;
    note?: string | null;
    activityId: string;
}
export declare class LearningActivityGql {
    id: string;
    title: string;
    kind: LearningKind;
    color: string;
    slots: LearningSlotGql[];
}
export declare class CreateLearningActivityInput {
    title: string;
    kind?: LearningKind;
    color?: string;
}
export declare class CreateLearningSlotInput {
    activityId: string;
    startDate: Date;
    endDate: Date;
    note?: string;
}
export declare class UpdateLearningSlotInput {
    id: string;
    startDate?: Date;
    endDate?: Date;
    note?: string;
}
export declare class ReminderGql {
    id: string;
    title: string;
    dueAt: Date;
    completed: boolean;
}
export declare class CreateReminderInput {
    title: string;
    dueAt: Date;
}
export declare class TodoGql {
    id: string;
    title: string;
    done: boolean;
    dueAt?: Date | null;
    priority: number;
}
export declare class CreateTodoInput {
    title: string;
    dueAt?: Date;
    priority: number;
}
export declare class BudgetAllocationGql {
    id: string;
    plannedAmount: number;
    note?: string | null;
    categoryId?: string | null;
}
export declare class BudgetPlanGql {
    id: string;
    type: BudgetPeriodType;
    startDate: Date;
    endDate: Date;
    description?: string | null;
    allocations: BudgetAllocationGql[];
}
export declare class BudgetAllocationInput {
    plannedAmount: number;
    note?: string;
    categoryId?: string;
}
export declare class CreateBudgetPlanInput {
    type: BudgetPeriodType;
    startDate: Date;
    endDate: Date;
    description?: string;
    allocations: BudgetAllocationInput[];
}
export declare class ItemListRowGql {
    id: string;
    text: string;
    sortOrder: number;
    listId: string;
}
export declare class ItemListGql {
    id: string;
    name: string;
    rows: ItemListRowGql[];
}
export declare class CreateItemListInput {
    name: string;
}
export declare class RenameItemListInput {
    id: string;
    name: string;
}
export declare class AddItemListRowInput {
    listId: string;
    text: string;
}
