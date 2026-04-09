"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationTiming = void 0;
exports.registerGraphqlEnums = registerGraphqlEnums;
const graphql_1 = require("@nestjs/graphql");
const client_1 = require("@prisma/client");
var NotificationTiming;
(function (NotificationTiming) {
    NotificationTiming["DAY_BEFORE"] = "DAY_BEFORE";
    NotificationTiming["WEEK_BEFORE"] = "WEEK_BEFORE";
})(NotificationTiming || (exports.NotificationTiming = NotificationTiming = {}));
function registerGraphqlEnums() {
    (0, graphql_1.registerEnumType)(client_1.TransactionType, { name: 'TransactionType' });
    (0, graphql_1.registerEnumType)(client_1.BudgetPeriodType, { name: 'BudgetPeriodType' });
    (0, graphql_1.registerEnumType)(client_1.LearningKind, { name: 'LearningKind' });
    (0, graphql_1.registerEnumType)(NotificationTiming, { name: 'NotificationTiming' });
}
//# sourceMappingURL=graphql-enums.js.map