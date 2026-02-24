import { ilike, SQL } from 'drizzle-orm';
import { PgTable, PgColumn } from 'drizzle-orm/pg-core';

type Primitive = string | number | boolean | Date | undefined | null;
type Filter<T extends PgTable> = Partial<Record<keyof T, Primitive>>;

/**
 * Creates an array of `SQL` conditions (combined with AND later) from one or many
 * filter objects. Accepts either a single filter object or an array of them for
 * convenience.
 */
export function getWhereConditions<T extends PgTable>(
	table: T,
	filters: Filter<T> | Filter<T>[],
	defaultWhereConditions: SQL[] = [],
) {
	const whereConditions: SQL[] = [...defaultWhereConditions];

	const filterArray: Filter<T>[] = Array.isArray(filters) ? filters : [filters];

	for (const filter of filterArray) {
		for (const key in filter) {
			if (Object.prototype.hasOwnProperty.call(filter, key) && filter[key]) {
				const column = table[key as keyof T] as PgColumn;

				if (column instanceof PgColumn && column.dataType === 'string') {
					whereConditions.push(ilike(column, `%${filter[key]}%`));
				}
			}
		}
	}

	return whereConditions;
}
