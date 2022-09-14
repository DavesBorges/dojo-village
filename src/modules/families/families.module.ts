import { Module } from '@nestjs/common';
import { FamiliesService } from './families.service';
import { FamiliesController } from './families.controller';
import { FamiliesRepository } from './families.repository';

@Module({
  controllers: [FamiliesController],
  providers: [FamiliesService, FamiliesRepository],
})
export class FamiliesModule {}
