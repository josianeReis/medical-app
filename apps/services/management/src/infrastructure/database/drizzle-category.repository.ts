import {
	CategoryFilters,
	CategoryRepository,
	CreateCategoryData,
	UpdateCategoryData,
} from '@/application/ports/out/category-repository';
import { Category } from '@/domain/entities/category';
import { DbClientTransaction, schema } from '@packages/data-access';

import { Pagination } from '@/domain/entities/pagination';
import {
	DependencyError,
	DependentEntity,
} from '@/domain/errors/dependency-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { db as globalDb } from '@/infrastructure/config/db';
import { applyDynamicFilters, DynamicFilterConfig } from '@packages/utils';
import { and, eq, isNotNull, isNull, sql } from 'drizzle-orm';

const categoryFilterConfig: DynamicFilterConfig = {
	primaryTable: 'category',
	schemaMap: {
		category: schema.category,
	},
	joinMap: {},
};

export class DrizzleCategoryRepository implements CategoryRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreateCategoryData): Promise<Category> {
		const [category] = await this.dbClient
			.insert(schema.category)
			.values({
				name: data.name,
				organizationId: data.organizationId,
				createdBy: data.createdBy,
			})
			.returning();

		return category;
	}

	async update(id: string, data: UpdateCategoryData): Promise<Category> {
		const [category] = await this.dbClient
			.update(schema.category)
			.set({
				name: data.name,
				updatedBy: data.updatedBy,
				updatedAt: new Date(),
			})
			.where(eq(schema.category.id, id))
			.returning();

		if (!category) {
			throw new NotFoundError('errors.category_not_found');
		}

		return category;
	}

	async softDelete(id: string, deletedBy: string): Promise<void> {
		await this.dbClient
			.update(schema.category)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(eq(schema.category.id, id));
	}

	async permanentDelete(id: string): Promise<void> {
		// First check if the category exists and is soft deleted
		const category = await this.dbClient.query.category.findFirst({
			where: and(
				eq(schema.category.id, id),
				isNotNull(schema.category.deletedAt),
			),
		});

		if (!category) {
			throw new NotFoundError('errors.category_not_found_or_not_deleted');
		}

		// Check for dependent procedures
		const dependentProcedures = await this.dbClient
			.select({
				id: schema.procedure.id,
				name: schema.procedure.name,
			})
			.from(schema.procedureCategories)
			.innerJoin(
				schema.procedure,
				eq(schema.procedureCategories.procedureId, schema.procedure.id),
			)
			.where(
				and(
					eq(schema.procedureCategories.categoryId, id),
					isNull(schema.procedure.deletedAt), // Only check non-deleted procedures
				),
			);

		if (dependentProcedures.length > 0) {
			const dependents: DependentEntity[] = dependentProcedures.map((proc) => ({
				type: 'procedure',
				name: proc.name,
				id: proc.id,
			}));

			throw new DependencyError(
				'errors.category_has_dependent_procedures',
				dependents,
			);
		}

		// If no dependencies, proceed with permanent deletion
		// First delete the procedure categories relationships
		await this.dbClient
			.delete(schema.procedureCategories)
			.where(eq(schema.procedureCategories.categoryId, id));

		// Then delete the category
		await this.dbClient
			.delete(schema.category)
			.where(eq(schema.category.id, id));
	}

	async findById(id: string): Promise<Category | null> {
		const category = await this.dbClient.query.category.findFirst({
			where: and(eq(schema.category.id, id), isNull(schema.category.deletedAt)),
		});

		return category ?? null;
	}

	async findAll(
		organizationId: string,
		filters: CategoryFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<Category[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		const baseQuery = this.dbClient.select().from(schema.category).$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			sort,
			categoryFilterConfig,
		);

		const organizationCondition = eq(
			schema.category.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.category.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const categories = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(limit)
			.offset(offset);

		return categories;
	}

	async count(
		organizationId: string,
		filters: CategoryFilters,
	): Promise<number> {
		const baseQuery = this.dbClient
			.select({
				count: sql<number>`count(*)`.mapWith(Number),
			})
			.from(schema.category)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined, // Sorting is not needed for count
			categoryFilterConfig,
		);

		const organizationCondition = eq(
			schema.category.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.category.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const result = await (query as typeof baseQuery).where(finalConditions);

		return Number(result[0]?.count ?? 0);
	}
}
