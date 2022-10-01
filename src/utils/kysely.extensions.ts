import {
  AliasedRawBuilder,
  JoinReferenceExpression,
  RawBuilder,
  Selectable,
  Selection,
  sql,
} from 'kysely';
import { TableExpression } from 'kysely/dist/cjs/parser/table-parser';
import { From } from 'kysely/dist/cjs/parser/table-parser';
import { AliasedQueryBuilder, SelectQueryBuilder } from 'kysely';
import {
  AnyColumn,
  AnyColumnWithTable,
  Nullable,
} from 'kysely/dist/cjs/util/type-utils';

import {
  QueryBuilderWithSelection,
  SelectExpression,
} from 'kysely/dist/cjs/parser/select-parser';

export type UnionOfArrayElements<ARR_T extends Readonly<unknown[]>> =
  ARR_T[number];

export const camelCaseToSnakeCase = (camelCase: string) => {
  let snakeCase = camelCase[0];

  for (const char of camelCase.substring(1)) {
    if (char.toUpperCase() === char && char.toLowerCase() !== char) {
      snakeCase += `_${char.toLowerCase()}`;
    } else {
      snakeCase += char;
    }
  }

  return snakeCase;
};

/*
  Here is defined extesions imethod for the kysely query builder
*/
declare module 'kysely/dist/cjs/query-builder/select-query-builder' {
  interface SelectQueryBuilder<DB, TB extends keyof DB, O> {
    /**
     * Performs a left join with tableName and parentName in tableName.id = parentname.tableName
     * And query the columns of the tableName returning it's value as an object if using mysql2 or json string if using sqlite
     *
     * @param tableName
     * @param parentName
     * @param selections
     */
    defaultLeftJoinToJson<
      JTBLE extends TableExpression<DB, TB & string> & string,
      SE extends ReadonlyArray<keyof DB[TABLE]>,
      NAME extends ExtractAliasFromTableExpression<DB, JTBLE> & string,
      TABLE extends TableFromExpression<DB, JTBLE>,
    >(
      tableName: JTBLE,
      parentName: TB,
      selections: SE,
    ): QueryBuilderWithSelection<
      From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
      TB | TABLE,
      O,
      AliasedRawBuilder<
        Selection<From<DB, TABLE>, TABLE, UnionOfArrayElements<SE>>,
        SnakeToCamel<NAME>
      >
    >;

    /**
     * Performs a left join with **table** returning the **selections** as a json field
     * @param table
     * @param leftTableColumn
     * @param rightTableColumn
     * @param selections
     */
    leftJsonJoin<
      JTBLE extends TableExpression<DB, TB> & string,
      K1 extends JoinReferenceExpression<DB, TB, JTBLE> &
        AnyColumnWithTable<DB, TB>,
      K2 extends JoinReferenceExpression<DB, TB, JTBLE> &
        `${ExtractAliasFromTableExpression<DB, JTBLE>}.${string}`,
      SE extends ReadonlyArray<
        SelectExpression<DB, TABLE> & AnyColumn<DB, TABLE>
      >,
      NAME extends ExtractAliasFromTableExpression<DB, TB> & string,
      TABLE extends TableFromExpression<DB, JTBLE>,
    >(
      table: JTBLE,
      leftTableColumn: K1,
      rightTableColumn: K2,
      selections: SE,
    ): QueryBuilderWithSelection<
      From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
      TB | TABLE,
      O,
      AliasedRawBuilder<
        Selection<From<DB, JTBLE>, TABLE, UnionOfArrayElements<SE>>,
        SnakeToCamel<ExtractAliasFromTableExpression<DB, JTBLE> & string>
      >
    >;
  }
}

export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

/**
 * Extracts the extact table name of an table expresion like `table as alias`
 */
type TableFromExpression<DB, Expr> =
  Expr extends `${infer table extends keyof DB & string} as ${string}`
    ? table
    : Expr extends keyof DB
    ? Expr
    : never;

/**
 * Extracts the alias of a table expression like `table as alias`
 */
type ExtractAliasFromTableExpression<DB, TE> =
  TE extends `${string} as ${infer TA}`
    ? TA
    : TE extends keyof DB
    ? TE
    : TE extends AliasedQueryBuilder<any, any, any, infer QA>
    ? QA
    : TE extends (qb: any) => AliasedQueryBuilder<any, any, any, infer QA>
    ? QA
    : TE extends AliasedRawBuilder<any, infer RA>
    ? RA
    : TE extends (qb: any) => AliasedRawBuilder<any, infer RA>
    ? RA
    : never;

/**
 * Represents the result of conversion to camelCase of snake case string **S**
 */
export type SnakeToCamel<S extends string> =
  S extends `${infer P1}_${infer P2}${infer P3}`
    ? `${Lowercase<P1>}${Uppercase<P2>}${SnakeToCamel<P3>}`
    : S;

/**
 * Represents the result type of conversion of camelCaseString T to snakeCase
 */
export type CamelToSnake<
  T extends string,
  P extends string = '',
> = string extends T
  ? string
  : T extends `${infer C0}${infer R}`
  ? CamelToSnake<
      R,
      `${P}${C0 extends Lowercase<C0> ? '' : '_'}${Lowercase<C0>}`
    >
  : P;

/**
 * Helper function to select an JSON_OBJECT from table **table**
 * @param table the table to retrieve the json object
 * @param selections the fields to select
 * @returns
 */
export const JSON_OBJECT = <
  DB,
  TB extends keyof DB & string,
  SE extends ReadonlyArray<keyof DB[TB]>,
>(
  table: TB,
  selections: SE,
) => {
  const entries = selections.map(
    (key) =>
      `'${typeof key === 'string' ? key : ''}', ${table}.${camelCaseToSnakeCase(
        typeof key === 'string' ? key : '',
      )} `,
  );
  const sql_snippet = `JSON_OBJECT(${entries.join(',')})`;

  return sql`${sql.raw(sql_snippet)}` as unknown as RawBuilder<
    Selection<
      From<DB, typeof table>,
      typeof table,
      UnionOfArrayElements<typeof selections>
    >
  >;
};
SelectQueryBuilder.prototype.defaultLeftJoinToJson = function <
  DB,
  TB extends keyof DB & string,
  O,
  JTBLE extends TableExpression<DB, TB> & string,
  SE extends ReadonlyArray<keyof DB[TABLE]>,
  NAME extends ExtractAliasFromTableExpression<DB, JTBLE> & string,
  TABLE extends TableFromExpression<DB, JTBLE>,
>(
  this: SelectQueryBuilder<DB, TB, O>,
  tableNameImpl: JTBLE,
  parentName: TB,
  selections: SE,
) {
  // Default alias to the tableName
  let alias: NAME = tableNameImpl as unknown as NAME;

  // Default the really table name to table name in case we are not using an alias
  let realTableName = tableNameImpl as unknown as TABLE;

  // This is how we check for alias. If there is a space in the tableName it means
  // it's an alias
  const indexOfSpace = realTableName.indexOf(' ');
  if (indexOfSpace > 0) {
    // Extract the actual tableName
    realTableName = realTableName.substring(0, indexOfSpace) as TABLE;

    // Extract the alias and snakeCaseIt
    alias = tableNameImpl.substring(tableNameImpl.lastIndexOf(' ') + 1) as NAME;
    alias = camelToSnakeCase(alias) as NAME;
  }

  // Preapare the join arguments
  const homeJoinExpression =
    `${parentName}.${realTableName}` as JoinReferenceExpression<DB, TB, JTBLE>;
  const foreignJoinExpression = `${alias}.id` as JoinReferenceExpression<
    DB,
    TB,
    JTBLE
  >;

  // Perform the join
  const joined = this.leftJoin(
    tableNameImpl,
    homeJoinExpression,
    foreignJoinExpression,
  ) as SelectQueryBuilder<
    From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
    TB | TABLE,
    O
  >;

  // Invoke the JSON_OBJECT to return the JSON representation of selections passing it as alias
  const json = joined.select(
    JSON_OBJECT<DB, TABLE, SE>(alias as unknown as TABLE, selections).as(alias),
  );
  return json;
};

SelectQueryBuilder.prototype.leftJsonJoin = function <
  DB,
  TB extends keyof DB & string,
  O,
  JTBLE extends TableExpression<DB, TB> & string,
  K1 extends JoinReferenceExpression<DB, TB, JTBLE>,
  K2 extends JoinReferenceExpression<DB, TB, JTBLE>,
  SE extends ReadonlyArray<SelectExpression<DB, TABLE> & AnyColumn<DB, TABLE>>,
  NAME extends ExtractAliasFromTableExpression<DB, TB> & string,
  TABLE extends TableFromExpression<DB, JTBLE> & string,
>(
  this: SelectQueryBuilder<DB, TB, O>,
  table: JTBLE,
  k1: K1,
  k2: K2,
  selections: SE,
): QueryBuilderWithSelection<
  From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
  TB | TABLE,
  O,
  AliasedRawBuilder<
    Selection<From<DB, JTBLE>, TABLE, UnionOfArrayElements<SE>>,
    SnakeToCamel<ExtractAliasFromTableExpression<DB, JTBLE> & string>
  >
> {
  // Default alias to the tableName
  let alias: NAME = table as unknown as NAME & string;

  // Default the really table name to table name in case we are not using an alias
  let realTableName = table as unknown as TABLE & string;

  // This is how we check for alias. If there is a space in the tableName it means
  // it's an alias
  const indexOfSpace = realTableName.indexOf(' ');
  if (indexOfSpace > 0) {
    // Extract the actual tableName
    realTableName = realTableName.substring(0, indexOfSpace) as TABLE & string;

    // Extract the alias and snakeCaseIt
    alias = table.substring(table.lastIndexOf(' ') + 1) as NAME;
    alias = camelToSnakeCase(alias) as NAME;
  }

  // Perform the join
  const joined = this.leftJoin(table, k1, k2) as SelectQueryBuilder<
    From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
    TB | TABLE,
    O
  >;

  // Invoke the JSON_OBJECT to return the JSON representation of selections passing it as alias
  const json = joined.select(
    JSON_OBJECT<DB, TABLE, SE>(alias as unknown as TABLE, selections).as(alias),
  );
  return json as QueryBuilderWithSelection<
    From<DB, TB> & Record<NAME, Nullable<DB[TABLE]>>,
    TB | TABLE,
    O,
    AliasedRawBuilder<
      Selection<From<DB, JTBLE>, TABLE, UnionOfArrayElements<SE>>,
      SnakeToCamel<ExtractAliasFromTableExpression<DB, JTBLE> & string>
    >
  >;
};
// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;

export type AllSelection<DB, TB extends keyof DB> = Selectable<{
  [C in AnyColumn<DB, TB>]: {
    [T in TB]: C extends keyof DB[T] ? DB[T][C] : never;
  }[TB];
}>;
