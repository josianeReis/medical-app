import { drizzle } from 'drizzle-orm/node-postgres';

// for query purposes
function getDbClient(dbUrl: string) {
	return drizzle(dbUrl);
}
export { getDbClient };
