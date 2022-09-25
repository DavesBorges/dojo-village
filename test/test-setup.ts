import {
  DynamicModule,
  ForwardReference,
  Type,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import Database = require('better-sqlite3');
import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import { DB } from '../src/data/schema-definition';
import { database, setupDatabase } from '../src/data/setup_database';
import { BusinessLogicExceptionFilter } from '../src/exceptions/exceptions-filter';

export const mockGlobalDatabase = () => {
  const testDataBaseSnapshot = new Database(process.env.DB_PATH).serialize();
  const inMemoryTestDatabase = new Database(testDataBaseSnapshot);

  const kyselyDatabase = new Kysely<DB>({
    dialect: new SqliteDialect({
      database: inMemoryTestDatabase,
    }),
    plugins: [new CamelCasePlugin()],
  });

  setupDatabase(kyselyDatabase);
};

export const initModuleForE2ETest = async (
  modules: (
    | Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | ForwardReference<any>
  )[],
) => {
  mockGlobalDatabase();
  const moduleRef = await Test.createTestingModule({
    imports: modules,
  }).compile();

  const app = moduleRef.createNestApplication();
  app.useGlobalFilters(new BusinessLogicExceptionFilter());
  // Set the validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  await app.init();

  return app;
};
