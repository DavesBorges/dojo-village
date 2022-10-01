import { Module } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { ActionsGateway } from './actions.gateway';

@Module({
  providers: [ActionsGateway, ActionsService],
})
export class ActionsModule {}
