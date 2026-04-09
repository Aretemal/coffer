import { PrismaService } from '../prisma/prisma.service';
import { AuthUser } from '../common/decorators/current-user.decorator';
import { AccountGql, CreateAccountInput, CreateCategoryInput, CreateTransactionInput, MoneySummaryGql, MonthlyIncomePlanGql, SetMonthlyIncomePlanInput, SetWeeklyExpensePlanInput, UpdateAccountInput, WeeklyExpensePlanGql } from '../graphql/models';
import { RedisService } from '../redis/redis.service';
import { KafkaService } from '../kafka/kafka.service';
export declare class MoneyResolver {
    private readonly prisma;
    private readonly redis;
    private readonly kafka;
    constructor(prisma: PrismaService, redis: RedisService, kafka: KafkaService);
    categories(auth: AuthUser): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        color: string;
        userId: string;
    }[]>;
    createCategory(auth: AuthUser, input: CreateCategoryInput): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        name: string;
        color: string;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    deleteCategory(auth: AuthUser, id: string): Promise<boolean>;
    transactions(auth: AuthUser, from?: Date, to?: Date): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        occurredAt: Date;
        note: string | null;
        categoryId: string | null;
        userId: string;
    }[]>;
    createTransaction(auth: AuthUser, input: CreateTransactionInput): Promise<{
        amount: number;
        id: string;
        createdAt: Date;
        type: import(".prisma/client").$Enums.TransactionType;
        occurredAt: Date;
        note: string | null;
        categoryId: string | null;
        userId: string;
    }>;
    deleteTransaction(auth: AuthUser, id: string): Promise<boolean>;
    moneySummary(auth: AuthUser, month?: number, year?: number): Promise<MoneySummaryGql>;
    accounts(auth: AuthUser): Promise<AccountGql[]>;
    createAccount(auth: AuthUser, input: CreateAccountInput): Promise<{
        balance: number;
        id: string;
        name: string;
        currency: string;
        sortOrder: number;
        userId: string;
    }>;
    updateAccount(auth: AuthUser, input: UpdateAccountInput): Promise<{
        balance: number;
        id: string;
        name: string;
        currency: string;
        sortOrder: number;
        userId: string;
    }>;
    deleteAccount(auth: AuthUser, id: string): Promise<boolean>;
    monthlyIncomePlans(auth: AuthUser, year: number): Promise<MonthlyIncomePlanGql[]>;
    setMonthlyIncomePlan(auth: AuthUser, input: SetMonthlyIncomePlanInput): Promise<MonthlyIncomePlanGql>;
    weeklyExpensePlansForYear(auth: AuthUser, year: number): Promise<WeeklyExpensePlanGql[]>;
    setWeeklyExpensePlan(auth: AuthUser, input: SetWeeklyExpensePlanInput): Promise<WeeklyExpensePlanGql>;
}
