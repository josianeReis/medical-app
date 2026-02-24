import { drizzle, NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';
import * as schema from './index';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { ExtractTablesWithRelations } from 'drizzle-orm';

export type DbClient = ReturnType<typeof getDbClient>;

export interface DbClientTransaction
	extends PgTransaction<
		NodePgQueryResultHKT,
		typeof schema,
		ExtractTablesWithRelations<typeof schema>
	> {}


// for query purposes
function getDbClient(dbUrl: string) {
	return drizzle(dbUrl, { schema });
}

export { getDbClient };
