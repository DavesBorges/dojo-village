import { Module } from '@nestjs/common';
import { CharactersService } from './characters.service';
import { CharactersController } from './characters.controller';
import { CharactersRepository } from './characters-repository';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, CharactersRepository]
})
export class CharactersModule {}
