import * as path from 'path';

import { promises as fs } from 'fs';
import { Kysely, Migrator, SqliteDialect, FileMigrationProvider } from 'kysely';
import { DB } from './schema-definition';
import Database = require('better-sqlite3');

async function migrateToLatest() {
  const db = new Kysely<DB>({
    dialect: new SqliteDialect({ database: new Database('test-migration.db') }),
  });
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.resolve('src/data/migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((result) => {
    if (result.status === 'Success') {
      console.log(
        `migration "${result.migrationName}" was executed successfully`,
      );
    } else if (result.status === 'Error') {
      console.error(`failed to execute migration "${result.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
