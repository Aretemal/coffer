import { registerEnumType } from '@nestjs/graphql';
import { BudgetPeriodType, LearningKind, TransactionType } from '@prisma/client';

export enum NotificationTiming {
  DAY_BEFORE = 'DAY_BEFORE',
  WEEK_BEFORE = 'WEEK_BEFORE',
}

export function registerGraphqlEnums() {
  registerEnumType(TransactionType, { name: 'TransactionType' });
  registerEnumType(BudgetPeriodType, { name: 'BudgetPeriodType' });
  registerEnumType(LearningKind, { name: 'LearningKind' });
  registerEnumType(NotificationTiming, { name: 'NotificationTiming' });
}
