import { SQL, and, asc, desc } from 'drizzle-orm';
import { PgSelect, PgTable } from 'drizzle-orm/pg-core';
import { buildDrizzleWhere, Filter } from './build-drizzle-where';

interface JoinInfo {
	table: PgTable;
	on: SQL;
}

export interface DynamicFilterConfig {
	primaryTable: string;
	joinMap: Record<string, JoinInfo>;
	schemaMap: Record<string, PgTable>;
}

export function applyDynamicFilters<T extends PgSelect>(
	query: T,
	filters: Filter[],
	sort: string | undefined,
	config: DynamicFilterConfig,
): { query: T; conditions: SQL | undefined } {
	const { primaryTable, joinMap, schemaMap } = config;

	const filtersByTable = filters.reduce<Record<string, Filter[]>>(
		(acc, filter) => {
			const parts = filter.field.split('.');
			const tableName = parts.length > 1 ? parts[0] : primaryTable;
			const fieldName = parts.length > 1 ? parts[1] : parts[0];

			if (!acc[tableName]) {
				acc[tableName] = [];
			}
			acc[tableName].push({ ...filter, field: fieldName });
			return acc;
		},
		{},
	);

	const sortTables = new Set<string>();
	if (sort) {
		sort.split(',').forEach((field) => {
			const parts = field.split(':')[0].split('.');
			if (parts.length > 1) {
				sortTables.add(parts[0]);
			}
		});
	}

	const allTables = new Set([...Object.keys(filtersByTable), ...sortTables]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let qb: any = query;

	allTables.forEach((tableName) => {
		if (tableName !== primaryTable && joinMap[tableName]) {
			const joinInfo = joinMap[tableName];
			qb = qb.leftJoin(joinInfo.table, joinInfo.on);
		}
	});

	const whereClauses: SQL[] = [];
	for (const tableName in filtersByTable) {
		const tableSchema = schemaMap[tableName];
		if (tableSchema) {
			const whereClause = buildDrizzleWhere(
				tableSchema,
				filtersByTable[tableName],
			);
			if (whereClause) {
				whereClauses.push(whereClause);
			}
		}
	}

	if (sort) {
		const orderByClauses: SQL[] = [];
		sort.split(',').forEach((field) => {
			const [fieldPath, direction = 'asc'] = field.split(':');
			const parts = fieldPath.split('.');
			const tableName = parts.length > 1 ? parts[0] : primaryTable;
			const columnName = parts.length > 1 ? parts[1] : parts[0];

			const tableSchema = schemaMap[tableName];
			if (tableSchema) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const column = (tableSchema as any)[columnName];
				if (column) {
					const sortFn = direction.toLowerCase() === 'desc' ? desc : asc;
					orderByClauses.push(sortFn(column));
				}
			}
		});

		if (orderByClauses.length > 0) {
			qb = qb.orderBy(...orderByClauses);
		}
	}

	return {
		query: qb,
		conditions: and(...whereClauses),
	};
} 