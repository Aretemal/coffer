"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const apollo_1 = require("@nestjs/apollo");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const path_1 = require("path");
const auth_module_1 = require("./auth/auth.module");
const graphql_enums_1 = require("./common/graphql-enums");
const kafka_module_1 = require("./kafka/kafka.module");
const learning_module_1 = require("./learning/learning.module");
const lists_module_1 = require("./lists/lists.module");
const money_module_1 = require("./money/money.module");
const notifications_module_1 = require("./notifications/notifications.module");
const planner_module_1 = require("./planner/planner.module");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const users_module_1 = require("./users/users.module");
(0, graphql_enums_1.registerGraphqlEnums)();
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: (0, path_1.join)(process.cwd(), 'src/schema.gql'),
                sortSchema: true,
                context: ({ req, res }) => ({ req, res }),
            }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            kafka_module_1.KafkaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            money_module_1.MoneyModule,
            planner_module_1.PlannerModule,
            notifications_module_1.NotificationsModule,
            learning_module_1.LearningModule,
            lists_module_1.ListsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map