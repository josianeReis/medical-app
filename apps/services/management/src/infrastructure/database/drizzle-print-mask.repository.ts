import {
	CreatePrintMaskData,
	PrintMaskFilters,
	PrintMaskRepository,
	UpdatePrintMaskData,
} from '@/application/ports/out/print-mask-repository';
import { Pagination } from '@/domain/entities/pagination';
import { PrintMask } from '@/domain/entities/print-mask';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { db as globalDb } from '@/infrastructure/config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { applyDynamicFilters, DynamicFilterConfig } from '@packages/utils';
import { and, eq, isNotNull, isNull, sql, inArray } from 'drizzle-orm';

const maskFilterConfig: DynamicFilterConfig = {
	primaryTable: 'print_mask',
	schemaMap: {
		print_mask: schema.printMask,
	},
	joinMap: {},
};

export class DrizzlePrintMaskRepository implements PrintMaskRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreatePrintMaskData): Promise<PrintMask> {
		const [mask] = await this.dbClient
			.insert(schema.printMask)
			.values({
				...data,
				createdAt: new Date(),
			})
			.returning();

		return mask;
	}

	async update(id: string, data: UpdatePrintMaskData): Promise<PrintMask> {
		const [mask] = await this.dbClient
			.update(schema.printMask)
			.set({
				...data,
			})
			.where(eq(schema.printMask.id, id))
			.returning();

		if (!mask) {
			throw new NotFoundError('errors.print_mask_not_found');
		}

		return mask;
	}

	async softDelete(id: string, deletedBy: string): Promise<void> {
		await this.dbClient
			.update(schema.printMask)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(eq(schema.printMask.id, id));
	}

	async permanentDelete(id: string): Promise<void> {
		const mask = await this.dbClient.query.printMask.findFirst({
			where: and(
				eq(schema.printMask.id, id),
				isNotNull(schema.printMask.deletedAt),
			),
		});

		if (!mask) {
			throw new NotFoundError('errors.print_mask_not_found_or_not_deleted');
		}

		await this.dbClient
			.delete(schema.printMask)
			.where(eq(schema.printMask.id, id));
	}

	async findById(id: string): Promise<PrintMask | null> {
		const mask = await this.dbClient.query.printMask.findFirst({
			where: and(
				eq(schema.printMask.id, id),
				isNull(schema.printMask.deletedAt),
			),
			with: {
				organization: true,
			},
		});

		return mask ?? null;
	}

	async findAll(
		organizationId: string,
		filters: PrintMaskFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<PrintMask[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		const baseQuery = this.dbClient
			.select({ id: schema.printMask.id })
			.from(schema.printMask)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			sort,
			maskFilterConfig,
		);

		const organizationCondition = eq(
			schema.printMask.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.printMask.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const maskIds = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(limit)
			.offset(offset);

		if (maskIds.length === 0) {
			return [];
		}

		const masks = await this.dbClient.query.printMask.findMany({
			where: and(
				inArray(
					schema.printMask.id,
					maskIds.map((m) => m.id),
				),
				isNull(schema.printMask.deletedAt),
			),
			with: {
				organization: true,
			},
		});

		return masks;
	}

	async count(
		organizationId: string,
		filters: PrintMaskFilters,
	): Promise<number> {
		const baseQuery = this.dbClient
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(schema.printMask)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined,
			maskFilterConfig,
		);

		const organizationCondition = eq(
			schema.printMask.organizationId,
			organizationId,
		);
		const notDeletedCondition = isNull(schema.printMask.deletedAt);
		const finalConditions = and(
			organizationCondition,
			notDeletedCondition,
			conditions,
		);

		const result = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(1);

		return result[0]?.count ?? 0;
	}
}
