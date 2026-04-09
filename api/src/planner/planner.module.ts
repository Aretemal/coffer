import { Module } from '@nestjs/common';
import { PlannerResolver } from './planner.resolver';

@Module({
  providers: [PlannerResolver],
})
export class PlannerModule {}
