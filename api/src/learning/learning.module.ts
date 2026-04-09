import { Module } from '@nestjs/common';
import { LearningResolver } from './learning.resolver';

@Module({
  providers: [LearningResolver],
})
export class LearningModule {}
