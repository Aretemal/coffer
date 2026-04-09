import { Module } from '@nestjs/common';
import { MoneyResolver } from './money.resolver';

@Module({
  providers: [MoneyResolver],
})
export class MoneyModule {}
