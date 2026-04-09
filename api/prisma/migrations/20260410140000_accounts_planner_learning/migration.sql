-- AlterTable
ALTER TABLE "CalendarEvent" ADD COLUMN     "notifyDayBefore" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyWeekBefore" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum
CREATE TYPE "LearningKind" AS ENUM ('BOOK', 'COURSE', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'RUB',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyIncomePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "plannedAmount" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "MonthlyIncomePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyExpensePlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" DATE NOT NULL,
    "plannedAmount" DECIMAL(14,2) NOT NULL,
    "note" TEXT,

    CONSTRAINT "WeeklyExpensePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningActivity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "kind" "LearningKind" NOT NULL DEFAULT 'OTHER',
    "color" TEXT NOT NULL DEFAULT '#a78bfa',
    "userId" TEXT NOT NULL,

    CONSTRAINT "LearningActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningSlot" (
    "id" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "note" TEXT,
    "activityId" TEXT NOT NULL,

    CONSTRAINT "LearningSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_sortOrder_idx" ON "Account"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyIncomePlan_userId_year_month_key" ON "MonthlyIncomePlan"("userId", "year", "month");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyExpensePlan_userId_weekStart_key" ON "WeeklyExpensePlan"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "LearningActivity_userId_idx" ON "LearningActivity"("userId");

-- CreateIndex
CREATE INDEX "LearningSlot_activityId_startDate_idx" ON "LearningSlot"("activityId", "startDate");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyIncomePlan" ADD CONSTRAINT "MonthlyIncomePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyExpensePlan" ADD CONSTRAINT "WeeklyExpensePlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningActivity" ADD CONSTRAINT "LearningActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningSlot" ADD CONSTRAINT "LearningSlot_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "LearningActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
