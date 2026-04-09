import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { CreateBudgetPlanInput, CreateCalendarEventInput, CreateReminderInput, CreateTodoInput, UpdateCalendarEventInput } from '../graphql/models';
import { KafkaService } from '../kafka/kafka.service';
export declare class PlannerResolver {
    private readonly prisma;
    private readonly kafka;
    constructor(prisma: PrismaService, kafka: KafkaService);
    calendarEvents(auth: AuthUser, from: Date, to: Date): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        allDay: boolean;
        notifyDayBefore: boolean;
        notifyWeekBefore: boolean;
        userId: string;
    }[]>;
    createCalendarEvent(auth: AuthUser, input: CreateCalendarEventInput): Promise<{
        id: string;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        allDay: boolean;
        notifyDayBefore: boolean;
        notifyWeekBefore: boolean;
        userId: string;
    }>;
    updateCalendarEvent(auth: AuthUser, input: UpdateCalendarEventInput): Promise<{
        id: string;
        title: string;
        startsAt: Date;
        endsAt: Date | null;
        allDay: boolean;
        notifyDayBefore: boolean;
        notifyWeekBefore: boolean;
        userId: string;
    }>;
    deleteCalendarEvent(auth: AuthUser, id: string): Promise<boolean>;
    reminders(auth: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        dueAt: Date;
        completed: boolean;
        userId: string;
    }[]>;
    createReminder(auth: AuthUser, input: CreateReminderInput): Promise<{
        id: string;
        title: string;
        dueAt: Date;
        completed: boolean;
        userId: string;
    }>;
    toggleReminder(auth: AuthUser, id: string): Promise<{
        id: string;
        title: string;
        dueAt: Date;
        completed: boolean;
        userId: string;
    }>;
    deleteReminder(auth: AuthUser, id: string): Promise<boolean>;
    todos(auth: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        dueAt: Date | null;
        done: boolean;
        priority: number;
        userId: string;
    }[]>;
    createTodo(auth: AuthUser, input: CreateTodoInput): import(".prisma/client").Prisma.Prisma__TodoClient<{
        id: string;
        title: string;
        dueAt: Date | null;
        done: boolean;
        priority: number;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    toggleTodo(auth: AuthUser, id: string): Promise<{
        id: string;
        title: string;
        dueAt: Date | null;
        done: boolean;
        priority: number;
        userId: string;
    }>;
    deleteTodo(auth: AuthUser, id: string): Promise<boolean>;
    budgetPlans(auth: AuthUser): Promise<{
        allocations: {
            plannedAmount: number;
            id: string;
            note: string | null;
            categoryId: string | null;
            budgetPlanId: string;
        }[];
        id: string;
        type: import(".prisma/client").$Enums.BudgetPeriodType;
        startDate: Date;
        endDate: Date;
        description: string | null;
        userId: string;
    }[]>;
    createBudgetPlan(auth: AuthUser, input: CreateBudgetPlanInput): Promise<{
        allocations: {
            plannedAmount: number;
            id: string;
            note: string | null;
            categoryId: string | null;
            budgetPlanId: string;
        }[];
        id: string;
        type: import(".prisma/client").$Enums.BudgetPeriodType;
        startDate: Date;
        endDate: Date;
        description: string | null;
        userId: string;
    }>;
    deleteBudgetPlan(auth: AuthUser, id: string): Promise<boolean>;
}
