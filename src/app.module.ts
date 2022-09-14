import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ActionsModule } from './modules/actions/actions.module';
import { DatabaseModule } from './modules/database/database.module';
import { FamiliesModule } from './modules/families/families.module';

@Module({
  imports: [DatabaseModule, ActionsModule, FamiliesModule],
  providers: [AppService],
})
export class AppModule {}
