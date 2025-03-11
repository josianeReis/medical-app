import { ExtractTablesWithRelations } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

export { schema };
export { getDbClient } from './db';
export * from './schema';

export interface DbClientTransaction
	extends PgTransaction<
		PostgresJsQueryResultHKT,
		typeof schema,
		ExtractTablesWithRelations<typeof schema>
	> {}
