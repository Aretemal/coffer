import { Module } from '@nestjs/common';
import { ListsResolver } from './lists.resolver';

@Module({
  providers: [ListsResolver],
})
export class ListsModule {}
