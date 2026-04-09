import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { registerGraphqlEnums } from './common/graphql-enums';
import { KafkaModule } from './kafka/kafka.module';
import { LearningModule } from './learning/learning.module';
import { MoneyModule } from './money/money.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PlannerModule } from './planner/planner.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { UsersModule } from './users/users.module';

registerGraphqlEnums();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
    }),
    PrismaModule,
    RedisModule,
    KafkaModule,
    AuthModule,
    UsersModule,
    MoneyModule,
    PlannerModule,
    NotificationsModule,
    LearningModule,
  ],
})
export class AppModule {}
