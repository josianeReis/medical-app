import {
	CreateProcedureData,
	ProcedureFilters,
	ProcedureRepository,
	UpdateProcedureData,
} from '@/application/ports/out/procedure-repository';
import { Pagination } from '@/domain/entities/pagination';
import { Procedure, ProcedureWithCategory } from '@/domain/entities/procedure';
import {
	DependencyError,
	DependentEntity,
} from '@/domain/errors/dependency-error';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { db as globalDb } from '@/infrastructure/config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { applyDynamicFilters, DynamicFilterConfig } from '@packages/utils';
import { and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';

const procedureFilterConfig: DynamicFilterConfig = {
	primaryTable: 'procedure',
	schemaMap: {
		procedure: schema.procedure,
		category: schema.category,
		procedureCategories: schema.procedureCategories,
	},
	joinMap: {
		procedureCategories: {
			on: eq(schema.procedure.id, schema.procedureCategories.procedureId),
			table: schema.procedureCategories,
		},
		category: {
			on: eq(schema.procedureCategories.categoryId, schema.category.id),
			table: schema.category,
		},
	},
};

export class DrizzleProcedureRepository implements ProcedureRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreateProcedureData): Promise<Procedure> {
		const [procedure] = await this.dbClient
			.insert(schema.procedure)
			.values({
				name: data.name,
				duration: data.duration ?? null,
				code: data.code ?? null,
				organizationId: data.organizationId,
				createdBy: data.createdBy,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		if (procedure && data.categoryId) {
			await this.dbClient.insert(schema.procedureCategories).values({
				procedureId: procedure.id,
				categoryId: data.categoryId,
				createdAt: new Date(),
			});
		}

		return procedure;
	}

	async update(id: string, data: UpdateProcedureData): Promise<Procedure> {
		const { name, duration, code, categoryId, updatedBy } = data;
		const [procedure] = await this.dbClient
			.update(schema.procedure)
			.set({
				name,
				duration,
				code,
				updatedBy,
				updatedAt: new Date(),
			})
			.where(eq(schema.procedure.id, id))
			.returning();

		if (!procedure) {
			throw new NotFoundError('errors.procedure_not_found');
		}

		if (categoryId) {
			await this.dbClient
				.delete(schema.procedureCategories)
				.where(eq(schema.procedureCategories.procedureId, id));

			await this.dbClient.insert(schema.procedureCategories).values({
				procedureId: id,
				categoryId: categoryId,
				createdAt: new Date(),
			});
		}

		return procedure;
	}

	async softDelete(id: string, deletedBy: string): Promise<void> {
		await this.dbClient
			.update(schema.procedure)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(eq(schema.procedure.id, id));
	}

	async permanentDelete(id: string): Promise<void> {
		// First check if the procedure exists and is soft deleted
		const procedure = await this.dbClient.query.procedure.findFirst({
			where: and(
				eq(schema.procedure.id, id),
				isNotNull(schema.procedure.deletedAt),
			),
		});

		if (!procedure) {
			throw new NotFoundError('errors.procedure_not_found_or_not_deleted');
		}

		// Check for dependent templates
		const dependentTemplates = await this.dbClient
			.select({
				id: schema.template.id,
				name: schema.template.name,
			})
			.from(schema.template)
			.where(
				and(
					eq(schema.template.procedureId, id),
					isNull(schema.template.deletedAt), // Only check non-deleted templates
				),
			);

		if (dependentTemplates.length > 0) {
			const dependents: DependentEntity[] = dependentTemplates.map(
				(template) => ({
					type: 'template',
					name: template.name,
					id: template.id,
				}),
			);

			throw new DependencyError(
				'errors.procedure_has_dependent_templates',
				dependents,
			);
		}

		// If no dependencies, proceed with permanent deletion
		// First delete the procedure categories relationships
		await this.dbClient
			.delete(schema.procedureCategories)
			.where(eq(schema.procedureCategories.procedureId, id));

		// Then delete the procedure
		await this.dbClient
			.delete(schema.procedure)
			.where(eq(schema.procedure.id, id));
	}

	async findById(id: string): Promise<ProcedureWithCategory | null> {
		const procedure = await this.dbClient.query.procedure.findFirst({
			where: and(
				eq(schema.procedure.id, id),
				isNull(schema.procedure.deletedAt),
			),
			with: {
				procedureCategories: {
					with: {
						category: true,
					},
				},
			},
		});

		if (!procedure) return null;

		// Transform the result to match ProcedureWithCategory type
		const category = procedure.procedureCategories[0]?.category || null;

		return {
			...procedure,
			category,
		};
	}

	async findAll(
		organizationId: string,
		filters: ProcedureFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<ProcedureWithCategory[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		// First, get the procedure IDs with filtering and pagination
		const baseQuery = this.dbClient
			.selectDistinct({ id: schema.procedure.id })
			.from(schema.procedure)
			.leftJoin(
				schema.procedureCategories,
				eq(schema.procedure.id, schema.procedureCategories.procedureId),
			)
			.leftJoin(
				schema.category,
				eq(schema.procedureCategories.categoryId, schema.category.id),
			)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			sort,
			procedureFilterConfig,
		);

		const organizationCondition = eq(
			schema.procedure.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.procedure.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const procedureIds = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(limit)
			.offset(offset);

		if (procedureIds.length === 0) {
			return [];
		}

		// Then fetch the full procedures with categories using 'with' pattern
		const procedures = await this.dbClient.query.procedure.findMany({
			where: and(
				inArray(
					schema.procedure.id,
					procedureIds.map((p) => p.id),
				),
				isNull(schema.procedure.deletedAt),
			),
			with: {
				procedureCategories: {
					with: {
						category: true,
					},
				},
			},
		});

		// Transform the results to match ProcedureWithCategory type
		return procedures.map((procedure) => {
			const category = procedure.procedureCategories[0]?.category || null;
			return {
				...procedure,
				category,
			};
		});
	}

	async count(
		organizationId: string,
		filters: ProcedureFilters,
	): Promise<number> {
		const baseQuery = this.dbClient
			.select({
				count: sql<number>`count(distinct ${schema.procedure.id})`.mapWith(
					Number,
				),
			})
			.from(schema.procedure)
			.leftJoin(
				schema.procedureCategories,
				eq(schema.procedure.id, schema.procedureCategories.procedureId),
			)
			.leftJoin(
				schema.category,
				eq(schema.procedureCategories.categoryId, schema.category.id),
			)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined, // Sorting is not needed for count
			procedureFilterConfig,
		);

		const organizationCondition = eq(
			schema.procedure.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.procedure.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const result = await (query as typeof baseQuery).where(finalConditions);

		return result[0].count;
	}
}
