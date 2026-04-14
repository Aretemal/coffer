"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddItemListRowInput = exports.RenameItemListInput = exports.CreateItemListInput = exports.ItemListGql = exports.ItemListRowGql = exports.CreateBudgetPlanInput = exports.BudgetAllocationInput = exports.BudgetPlanGql = exports.BudgetAllocationGql = exports.CreateTodoInput = exports.TodoGql = exports.CreateReminderInput = exports.ReminderGql = exports.UpdateLearningSlotInput = exports.CreateLearningSlotInput = exports.CreateLearningActivityInput = exports.LearningActivityGql = exports.LearningSlotGql = exports.EventNotificationGql = exports.SetWeeklyExpensePlanInput = exports.WeeklyExpensePlanGql = exports.SetMonthlyIncomePlanInput = exports.MonthlyIncomePlanGql = exports.UpdateAccountInput = exports.CreateAccountInput = exports.AccountGql = exports.UpdateCalendarEventInput = exports.CreateCalendarEventInput = exports.CalendarEventGql = exports.MoneySummaryGql = exports.CreateTransactionInput = exports.TransactionGql = exports.CreateCategoryInput = exports.CategoryGql = exports.LoginInput = exports.RegisterInput = exports.AuthPayload = exports.UserGql = void 0;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
const graphql_enums_1 = require("../common/graphql-enums");
const class_validator_1 = require("class-validator");
let UserGql = class UserGql {
};
exports.UserGql = UserGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UserGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], UserGql.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], UserGql.prototype, "name", void 0);
exports.UserGql = UserGql = __decorate([
    (0, graphql_1.ObjectType)()
], UserGql);
let AuthPayload = class AuthPayload {
};
exports.AuthPayload = AuthPayload;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AuthPayload.prototype, "accessToken", void 0);
__decorate([
    (0, graphql_1.Field)(() => UserGql),
    __metadata("design:type", UserGql)
], AuthPayload.prototype, "user", void 0);
exports.AuthPayload = AuthPayload = __decorate([
    (0, graphql_1.ObjectType)()
], AuthPayload);
let RegisterInput = class RegisterInput {
};
exports.RegisterInput = RegisterInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterInput.prototype, "password", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterInput.prototype, "name", void 0);
exports.RegisterInput = RegisterInput = __decorate([
    (0, graphql_1.InputType)()
], RegisterInput);
let LoginInput = class LoginInput {
};
exports.LoginInput = LoginInput;
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginInput.prototype, "email", void 0);
__decorate([
    (0, graphql_1.Field)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], LoginInput.prototype, "password", void 0);
exports.LoginInput = LoginInput = __decorate([
    (0, graphql_1.InputType)()
], LoginInput);
let CategoryGql = class CategoryGql {
};
exports.CategoryGql = CategoryGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], CategoryGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CategoryGql.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CategoryGql.prototype, "color", void 0);
exports.CategoryGql = CategoryGql = __decorate([
    (0, graphql_1.ObjectType)()
], CategoryGql);
let CreateCategoryInput = class CreateCategoryInput {
};
exports.CreateCategoryInput = CreateCategoryInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: '#6366f1' }),
    __metadata("design:type", String)
], CreateCategoryInput.prototype, "color", void 0);
exports.CreateCategoryInput = CreateCategoryInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCategoryInput);
let TransactionGql = class TransactionGql {
};
exports.TransactionGql = TransactionGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], TransactionGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], TransactionGql.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.TransactionType),
    __metadata("design:type", String)
], TransactionGql.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], TransactionGql.prototype, "occurredAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], TransactionGql.prototype, "note", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", Object)
], TransactionGql.prototype, "categoryId", void 0);
exports.TransactionGql = TransactionGql = __decorate([
    (0, graphql_1.ObjectType)()
], TransactionGql);
let CreateTransactionInput = class CreateTransactionInput {
};
exports.CreateTransactionInput = CreateTransactionInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CreateTransactionInput.prototype, "amount", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.TransactionType),
    __metadata("design:type", String)
], CreateTransactionInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateTransactionInput.prototype, "occurredAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateTransactionInput.prototype, "note", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateTransactionInput.prototype, "categoryId", void 0);
exports.CreateTransactionInput = CreateTransactionInput = __decorate([
    (0, graphql_1.InputType)()
], CreateTransactionInput);
let MoneySummaryGql = class MoneySummaryGql {
};
exports.MoneySummaryGql = MoneySummaryGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], MoneySummaryGql.prototype, "income", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], MoneySummaryGql.prototype, "expense", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MoneySummaryGql.prototype, "periodStart", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], MoneySummaryGql.prototype, "periodEnd", void 0);
exports.MoneySummaryGql = MoneySummaryGql = __decorate([
    (0, graphql_1.ObjectType)()
], MoneySummaryGql);
let CalendarEventGql = class CalendarEventGql {
};
exports.CalendarEventGql = CalendarEventGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], CalendarEventGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CalendarEventGql.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CalendarEventGql.prototype, "startsAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Object)
], CalendarEventGql.prototype, "endsAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CalendarEventGql.prototype, "allDay", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CalendarEventGql.prototype, "notifyDayBefore", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], CalendarEventGql.prototype, "notifyWeekBefore", void 0);
exports.CalendarEventGql = CalendarEventGql = __decorate([
    (0, graphql_1.ObjectType)()
], CalendarEventGql);
let CreateCalendarEventInput = class CreateCalendarEventInput {
};
exports.CreateCalendarEventInput = CreateCalendarEventInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateCalendarEventInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateCalendarEventInput.prototype, "startsAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], CreateCalendarEventInput.prototype, "endsAt", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateCalendarEventInput.prototype, "allDay", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateCalendarEventInput.prototype, "notifyDayBefore", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], CreateCalendarEventInput.prototype, "notifyWeekBefore", void 0);
exports.CreateCalendarEventInput = CreateCalendarEventInput = __decorate([
    (0, graphql_1.InputType)()
], CreateCalendarEventInput);
let UpdateCalendarEventInput = class UpdateCalendarEventInput {
};
exports.UpdateCalendarEventInput = UpdateCalendarEventInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateCalendarEventInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateCalendarEventInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], UpdateCalendarEventInput.prototype, "startsAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], UpdateCalendarEventInput.prototype, "endsAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UpdateCalendarEventInput.prototype, "allDay", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UpdateCalendarEventInput.prototype, "notifyDayBefore", void 0);
__decorate([
    (0, graphql_1.Field)(() => Boolean, { nullable: true }),
    __metadata("design:type", Boolean)
], UpdateCalendarEventInput.prototype, "notifyWeekBefore", void 0);
exports.UpdateCalendarEventInput = UpdateCalendarEventInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateCalendarEventInput);
let AccountGql = class AccountGql {
};
exports.AccountGql = AccountGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], AccountGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AccountGql.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], AccountGql.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AccountGql.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], AccountGql.prototype, "sortOrder", void 0);
exports.AccountGql = AccountGql = __decorate([
    (0, graphql_1.ObjectType)()
], AccountGql);
let CreateAccountInput = class CreateAccountInput {
};
exports.CreateAccountInput = CreateAccountInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], CreateAccountInput.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 'RUB' }),
    __metadata("design:type", String)
], CreateAccountInput.prototype, "currency", void 0);
exports.CreateAccountInput = CreateAccountInput = __decorate([
    (0, graphql_1.InputType)()
], CreateAccountInput);
let UpdateAccountInput = class UpdateAccountInput {
};
exports.UpdateAccountInput = UpdateAccountInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateAccountInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateAccountInput.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], UpdateAccountInput.prototype, "balance", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateAccountInput.prototype, "currency", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], UpdateAccountInput.prototype, "sortOrder", void 0);
exports.UpdateAccountInput = UpdateAccountInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateAccountInput);
let MonthlyIncomePlanGql = class MonthlyIncomePlanGql {
};
exports.MonthlyIncomePlanGql = MonthlyIncomePlanGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], MonthlyIncomePlanGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MonthlyIncomePlanGql.prototype, "year", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], MonthlyIncomePlanGql.prototype, "month", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], MonthlyIncomePlanGql.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], MonthlyIncomePlanGql.prototype, "description", void 0);
exports.MonthlyIncomePlanGql = MonthlyIncomePlanGql = __decorate([
    (0, graphql_1.ObjectType)()
], MonthlyIncomePlanGql);
let SetMonthlyIncomePlanInput = class SetMonthlyIncomePlanInput {
};
exports.SetMonthlyIncomePlanInput = SetMonthlyIncomePlanInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SetMonthlyIncomePlanInput.prototype, "year", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], SetMonthlyIncomePlanInput.prototype, "month", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], SetMonthlyIncomePlanInput.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SetMonthlyIncomePlanInput.prototype, "description", void 0);
exports.SetMonthlyIncomePlanInput = SetMonthlyIncomePlanInput = __decorate([
    (0, graphql_1.InputType)()
], SetMonthlyIncomePlanInput);
let WeeklyExpensePlanGql = class WeeklyExpensePlanGql {
};
exports.WeeklyExpensePlanGql = WeeklyExpensePlanGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], WeeklyExpensePlanGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], WeeklyExpensePlanGql.prototype, "weekStart", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], WeeklyExpensePlanGql.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], WeeklyExpensePlanGql.prototype, "note", void 0);
exports.WeeklyExpensePlanGql = WeeklyExpensePlanGql = __decorate([
    (0, graphql_1.ObjectType)()
], WeeklyExpensePlanGql);
let SetWeeklyExpensePlanInput = class SetWeeklyExpensePlanInput {
};
exports.SetWeeklyExpensePlanInput = SetWeeklyExpensePlanInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], SetWeeklyExpensePlanInput.prototype, "weekStart", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], SetWeeklyExpensePlanInput.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], SetWeeklyExpensePlanInput.prototype, "note", void 0);
exports.SetWeeklyExpensePlanInput = SetWeeklyExpensePlanInput = __decorate([
    (0, graphql_1.InputType)()
], SetWeeklyExpensePlanInput);
let EventNotificationGql = class EventNotificationGql {
};
exports.EventNotificationGql = EventNotificationGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], EventNotificationGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], EventNotificationGql.prototype, "eventId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EventNotificationGql.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], EventNotificationGql.prototype, "eventStartsAt", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_enums_1.NotificationTiming),
    __metadata("design:type", String)
], EventNotificationGql.prototype, "timing", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], EventNotificationGql.prototype, "message", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], EventNotificationGql.prototype, "fireAt", void 0);
exports.EventNotificationGql = EventNotificationGql = __decorate([
    (0, graphql_1.ObjectType)()
], EventNotificationGql);
let LearningSlotGql = class LearningSlotGql {
};
exports.LearningSlotGql = LearningSlotGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], LearningSlotGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], LearningSlotGql.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], LearningSlotGql.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], LearningSlotGql.prototype, "note", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], LearningSlotGql.prototype, "activityId", void 0);
exports.LearningSlotGql = LearningSlotGql = __decorate([
    (0, graphql_1.ObjectType)()
], LearningSlotGql);
let LearningActivityGql = class LearningActivityGql {
};
exports.LearningActivityGql = LearningActivityGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], LearningActivityGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LearningActivityGql.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.LearningKind),
    __metadata("design:type", String)
], LearningActivityGql.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], LearningActivityGql.prototype, "color", void 0);
__decorate([
    (0, graphql_1.Field)(() => [LearningSlotGql]),
    __metadata("design:type", Array)
], LearningActivityGql.prototype, "slots", void 0);
exports.LearningActivityGql = LearningActivityGql = __decorate([
    (0, graphql_1.ObjectType)()
], LearningActivityGql);
let CreateLearningActivityInput = class CreateLearningActivityInput {
};
exports.CreateLearningActivityInput = CreateLearningActivityInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateLearningActivityInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.LearningKind, { nullable: true }),
    __metadata("design:type", String)
], CreateLearningActivityInput.prototype, "kind", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateLearningActivityInput.prototype, "color", void 0);
exports.CreateLearningActivityInput = CreateLearningActivityInput = __decorate([
    (0, graphql_1.InputType)()
], CreateLearningActivityInput);
let CreateLearningSlotInput = class CreateLearningSlotInput {
};
exports.CreateLearningSlotInput = CreateLearningSlotInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], CreateLearningSlotInput.prototype, "activityId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateLearningSlotInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateLearningSlotInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateLearningSlotInput.prototype, "note", void 0);
exports.CreateLearningSlotInput = CreateLearningSlotInput = __decorate([
    (0, graphql_1.InputType)()
], CreateLearningSlotInput);
let UpdateLearningSlotInput = class UpdateLearningSlotInput {
};
exports.UpdateLearningSlotInput = UpdateLearningSlotInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], UpdateLearningSlotInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], UpdateLearningSlotInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], UpdateLearningSlotInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateLearningSlotInput.prototype, "note", void 0);
exports.UpdateLearningSlotInput = UpdateLearningSlotInput = __decorate([
    (0, graphql_1.InputType)()
], UpdateLearningSlotInput);
let ReminderGql = class ReminderGql {
};
exports.ReminderGql = ReminderGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ReminderGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ReminderGql.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], ReminderGql.prototype, "dueAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], ReminderGql.prototype, "completed", void 0);
exports.ReminderGql = ReminderGql = __decorate([
    (0, graphql_1.ObjectType)()
], ReminderGql);
let CreateReminderInput = class CreateReminderInput {
};
exports.CreateReminderInput = CreateReminderInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateReminderInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateReminderInput.prototype, "dueAt", void 0);
exports.CreateReminderInput = CreateReminderInput = __decorate([
    (0, graphql_1.InputType)()
], CreateReminderInput);
let TodoGql = class TodoGql {
};
exports.TodoGql = TodoGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], TodoGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], TodoGql.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Boolean)
], TodoGql.prototype, "done", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Object)
], TodoGql.prototype, "dueAt", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Number)
], TodoGql.prototype, "priority", void 0);
exports.TodoGql = TodoGql = __decorate([
    (0, graphql_1.ObjectType)()
], TodoGql);
let CreateTodoInput = class CreateTodoInput {
};
exports.CreateTodoInput = CreateTodoInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateTodoInput.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.GraphQLISODateTime, { nullable: true }),
    __metadata("design:type", Date)
], CreateTodoInput.prototype, "dueAt", void 0);
__decorate([
    (0, graphql_1.Field)({ defaultValue: 0 }),
    __metadata("design:type", Number)
], CreateTodoInput.prototype, "priority", void 0);
exports.CreateTodoInput = CreateTodoInput = __decorate([
    (0, graphql_1.InputType)()
], CreateTodoInput);
let BudgetAllocationGql = class BudgetAllocationGql {
};
exports.BudgetAllocationGql = BudgetAllocationGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], BudgetAllocationGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], BudgetAllocationGql.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], BudgetAllocationGql.prototype, "note", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", Object)
], BudgetAllocationGql.prototype, "categoryId", void 0);
exports.BudgetAllocationGql = BudgetAllocationGql = __decorate([
    (0, graphql_1.ObjectType)()
], BudgetAllocationGql);
let BudgetPlanGql = class BudgetPlanGql {
};
exports.BudgetPlanGql = BudgetPlanGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], BudgetPlanGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(() => client_1.BudgetPeriodType),
    __metadata("design:type", String)
], BudgetPlanGql.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BudgetPlanGql.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], BudgetPlanGql.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], BudgetPlanGql.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => [BudgetAllocationGql]),
    __metadata("design:type", Array)
], BudgetPlanGql.prototype, "allocations", void 0);
exports.BudgetPlanGql = BudgetPlanGql = __decorate([
    (0, graphql_1.ObjectType)()
], BudgetPlanGql);
let BudgetAllocationInput = class BudgetAllocationInput {
};
exports.BudgetAllocationInput = BudgetAllocationInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], BudgetAllocationInput.prototype, "plannedAmount", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], BudgetAllocationInput.prototype, "note", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], BudgetAllocationInput.prototype, "categoryId", void 0);
exports.BudgetAllocationInput = BudgetAllocationInput = __decorate([
    (0, graphql_1.InputType)()
], BudgetAllocationInput);
let CreateBudgetPlanInput = class CreateBudgetPlanInput {
};
exports.CreateBudgetPlanInput = CreateBudgetPlanInput;
__decorate([
    (0, graphql_1.Field)(() => client_1.BudgetPeriodType),
    __metadata("design:type", String)
], CreateBudgetPlanInput.prototype, "type", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateBudgetPlanInput.prototype, "startDate", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", Date)
], CreateBudgetPlanInput.prototype, "endDate", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], CreateBudgetPlanInput.prototype, "description", void 0);
__decorate([
    (0, graphql_1.Field)(() => [BudgetAllocationInput]),
    __metadata("design:type", Array)
], CreateBudgetPlanInput.prototype, "allocations", void 0);
exports.CreateBudgetPlanInput = CreateBudgetPlanInput = __decorate([
    (0, graphql_1.InputType)()
], CreateBudgetPlanInput);
let ItemListRowGql = class ItemListRowGql {
};
exports.ItemListRowGql = ItemListRowGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ItemListRowGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ItemListRowGql.prototype, "text", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], ItemListRowGql.prototype, "sortOrder", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ItemListRowGql.prototype, "listId", void 0);
exports.ItemListRowGql = ItemListRowGql = __decorate([
    (0, graphql_1.ObjectType)()
], ItemListRowGql);
let ItemListGql = class ItemListGql {
};
exports.ItemListGql = ItemListGql;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], ItemListGql.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], ItemListGql.prototype, "name", void 0);
__decorate([
    (0, graphql_1.Field)(() => [ItemListRowGql]),
    __metadata("design:type", Array)
], ItemListGql.prototype, "rows", void 0);
exports.ItemListGql = ItemListGql = __decorate([
    (0, graphql_1.ObjectType)()
], ItemListGql);
let CreateItemListInput = class CreateItemListInput {
};
exports.CreateItemListInput = CreateItemListInput;
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], CreateItemListInput.prototype, "name", void 0);
exports.CreateItemListInput = CreateItemListInput = __decorate([
    (0, graphql_1.InputType)()
], CreateItemListInput);
let RenameItemListInput = class RenameItemListInput {
};
exports.RenameItemListInput = RenameItemListInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], RenameItemListInput.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], RenameItemListInput.prototype, "name", void 0);
exports.RenameItemListInput = RenameItemListInput = __decorate([
    (0, graphql_1.InputType)()
], RenameItemListInput);
let AddItemListRowInput = class AddItemListRowInput {
};
exports.AddItemListRowInput = AddItemListRowInput;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.ID),
    __metadata("design:type", String)
], AddItemListRowInput.prototype, "listId", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], AddItemListRowInput.prototype, "text", void 0);
exports.AddItemListRowInput = AddItemListRowInput = __decorate([
    (0, graphql_1.InputType)()
], AddItemListRowInput);
//# sourceMappingURL=models.js.map