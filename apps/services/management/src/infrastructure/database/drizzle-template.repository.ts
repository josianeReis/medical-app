import {
	CreateTemplateData,
	TemplateFilters,
	TemplateRepository,
	UpdateTemplateData,
} from '@/application/ports/out/template-repository';
import { Pagination } from '@/domain/entities/pagination';
import { Template, TemplateWithProcedure } from '@/domain/entities/template';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { db as globalDb } from '@/infrastructure/config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { applyDynamicFilters, DynamicFilterConfig } from '@packages/utils';
import { and, eq, inArray, isNotNull, isNull, sql } from 'drizzle-orm';

const templateFilterConfig: DynamicFilterConfig = {
	primaryTable: 'template',
	schemaMap: {
		template: schema.template,
		procedure: schema.procedure,
	},
	joinMap: {
		procedure: {
			on: eq(schema.template.procedureId, schema.procedure.id),
			table: schema.procedure,
		},
	},
};

export class DrizzleTemplateRepository implements TemplateRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreateTemplateData): Promise<Template> {
		const [template] = await this.dbClient
			.insert(schema.template)
			.values({
				name: data.name,
				procedureId: data.procedureId,
				content: data.content,
				active: data.active ?? true,
				organizationId: data.organizationId,
				createdBy: data.createdBy,
				createdAt: new Date(),
			})
			.returning();

		return template;
	}

	async update(id: string, data: UpdateTemplateData): Promise<Template> {
		const [template] = await this.dbClient
			.update(schema.template)
			.set({
				name: data.name,
				procedureId: data.procedureId,
				content: data.content,
				active: data.active,
				updatedBy: data.updatedBy,
				updatedAt: new Date(),
			})
			.where(eq(schema.template.id, id))
			.returning();

		if (!template) {
			throw new NotFoundError('errors.template_not_found');
		}

		return template;
	}

	async softDelete(id: string, deletedBy: string): Promise<void> {
		await this.dbClient
			.update(schema.template)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(eq(schema.template.id, id));
	}

	async permanentDelete(id: string): Promise<void> {
		// First check if the template exists and is soft deleted
		const template = await this.dbClient.query.template.findFirst({
			where: and(
				eq(schema.template.id, id),
				isNotNull(schema.template.deletedAt),
			),
		});

		if (!template) {
			throw new NotFoundError('errors.template_not_found_or_not_deleted');
		}

		// Templates typically don't have dependencies, so proceed with deletion
		await this.dbClient
			.delete(schema.template)
			.where(eq(schema.template.id, id));
	}

	async findById(id: string): Promise<TemplateWithProcedure | null> {
		const template = await this.dbClient.query.template.findFirst({
			where: and(eq(schema.template.id, id), isNull(schema.template.deletedAt)),
			with: {
				procedure: true,
			},
		});

		return template ?? null;
	}

	async findAll(
		organizationId: string,
		filters: TemplateFilters,
		pagination: Pagination,
	): Promise<TemplateWithProcedure[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		// First, get the template IDs with filtering and pagination
		const baseQuery = this.dbClient
			.selectDistinct({ id: schema.template.id })
			.from(schema.template)
			.leftJoin(
				schema.procedure,
				eq(schema.procedure.id, schema.template.procedureId),
			)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined, // No sort for now
			templateFilterConfig,
		);

		const organizationCondition = eq(
			schema.template.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.template.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const templateIds = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(limit)
			.offset(offset);

		if (templateIds.length === 0) {
			return [];
		}

		// Then fetch the full templates with procedures using 'with' pattern
		const templates = await this.dbClient.query.template.findMany({
			where: and(
				inArray(
					schema.template.id,
					templateIds.map((t) => t.id),
				),
				isNull(schema.template.deletedAt),
			),
			with: {
				procedure: true,
			},
		});

		return templates;
	}

	async count(
		organizationId: string,
		filters: TemplateFilters,
	): Promise<number> {
		const baseQuery = this.dbClient
			.select({
				count: sql<number>`count(distinct ${schema.template.id})`.mapWith(
					Number,
				),
			})
			.from(schema.template)
			.leftJoin(
				schema.procedure,
				eq(schema.procedure.id, schema.template.procedureId),
			)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined, // Sorting is not needed for count
			templateFilterConfig,
		);

		const organizationCondition = eq(
			schema.template.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.template.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const result = await (query as typeof baseQuery).where(finalConditions);

		return Number(result[0]?.count ?? 0);
	}
}
