import {
	SQL,
	and,
	eq,
	gt,
	gte,
	ilike,
	inArray,
	isNotNull,
	isNull,
	like,
	lt,
	lte,
	ne,
	not,
	or,
} from 'drizzle-orm';
import { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export type Operator =
	| 'eq'
	| 'ne'
	| 'gt'
	| 'gte'
	| 'lt'
	| 'lte'
	| 'like'
	| 'ilike'
	| 'in'
	| 'notIn'
	| 'isNull'
	| 'isNotNull';

export interface Filter {
	field: string;
	operator: Operator;
	value?: any;
}

const operatorMap = {
	eq,
	ne,
	gt,
	gte,
	lt,
	lte,
	like,
	ilike,
	in: inArray,
	isNull,
	isNotNull,
};

export function buildDrizzleWhere<T extends PgTable>(
	table: T,
	filters?: Filter[],
	logicalOperator: 'AND' | 'OR' = 'AND',
): SQL | undefined {
	if (!filters || filters.length === 0) {
		return undefined;
	}

	const conditions = filters
		.map((filter) => {
			const column = table[filter.field as keyof T] as PgColumn;
			if (!column) {
				console.warn(`Column ${filter.field} not found on table.`);
				return undefined;
			}

			if (filter.operator === 'isNull' || filter.operator === 'isNotNull') {
				const opFn = operatorMap[filter.operator];
				return opFn(column);
			}

			if (filter.operator === 'in' || filter.operator === 'notIn') {
				if (!Array.isArray(filter.value) || filter.value.length === 0) {
					return undefined;
				}
				const condition = inArray(column, filter.value);
				return filter.operator === 'notIn' ? not(condition) : condition;
			}

			const opFn = operatorMap[filter.operator as keyof typeof operatorMap];
			if (!opFn) {
				console.warn(`Operator ${filter.operator} is not supported.`);
				return undefined;
			}

			// Handle 'eq' with an array value by treating it as an 'in'
			if (filter.operator === 'eq' && Array.isArray(filter.value)) {
				return inArray(column, filter.value);
			}

			return (opFn as (column: PgColumn, value: any) => SQL)(
				column,
				filter.value,
			);
		})
		.filter((c): c is SQL => !!c);

	if (conditions.length === 0) {
		return undefined;
	}

	if (logicalOperator === 'OR') {
		return or(...conditions);
	}
	return and(...conditions);
}