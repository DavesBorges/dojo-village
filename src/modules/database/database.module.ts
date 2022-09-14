import { Global, Module } from '@nestjs/common';
import { Kysely } from 'kysely';
import { database } from '../../data/setup_database';

export const KYSELY = 'KYSELY';
@Global()
@Module({
  providers: [{ provide: Kysely, useFactory: () => database }],
  exports: [Kysely],
})
export class DatabaseModule {}
