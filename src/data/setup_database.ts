import { CamelCasePlugin, Kysely, SqliteDialect } from 'kysely';
import { DB } from './schema-definition';
import * as dotenv from 'dotenv';
import Database = require('better-sqlite3');
dotenv.config();

export let database: Kysely<DB>;

/**
 * Sets the singleton databaseReference to the db argument or fallback to default
 * databaseReference if the function is called with no arguments
 *
 * @param db the db reference to set as the global database
 */
export const setupDatabase = (db?: Kysely<DB>) => {
  if (!db) {
    db = new Kysely<DB>({
      dialect: new SqliteDialect({
        database: new Database(process.env.DB_PATH),
      }),
      plugins: [new CamelCasePlugin()],
    });
  }
  database = db;
};
