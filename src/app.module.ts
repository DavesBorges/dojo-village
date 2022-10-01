import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ActionsModule } from './modules/actions/actions.module';
import { CharactersModule } from './modules/characters/characters.module';
import { DatabaseModule } from './modules/database/database.module';
import { FamiliesModule } from './modules/families/families.module';
import { SkillsModule } from './modules/skills/skills.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ActionsModule,
    FamiliesModule,
    UsersModule,
    CharactersModule,
    SkillsModule,
  ],
  providers: [AppService],
})
export class AppModule {}
