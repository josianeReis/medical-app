import {
	CreateReportData,
	ReportFilters,
	ReportRepository,
	UpdateReportData,
} from '@/application/ports/out/report-repository';
import { Pagination } from '@/domain/entities/pagination';
import { Report } from '@/domain/entities/report';
import { db as globalDb } from '@/infrastructure/config/db';
import {
	DbClientTransaction,
	patient,
	printMask,
	procedure,
	report as rpt,
	template,
} from '@packages/data-access';
import { applyDynamicFilters, DynamicFilterConfig } from '@packages/utils';
import { eq, inArray, sql, and } from 'drizzle-orm';

const filterConfig: DynamicFilterConfig = {
	primaryTable: 'report',
	schemaMap: { report: rpt, patient, procedure, template, printMask },
	joinMap: {
		patient: { on: eq(rpt.patientId, patient.id), table: patient },
		procedure: { on: eq(rpt.procedureId, procedure.id), table: procedure },
		template: { on: eq(rpt.templateId, template.id), table: template },
		printMask: { on: eq(rpt.maskId, printMask.id), table: printMask },
	},
};

export class DrizzleReportRepository implements ReportRepository {
	constructor(private readonly tx?: DbClientTransaction) {}
	private get db() {
		return this.tx ?? globalDb;
	}

	async create(data: CreateReportData): Promise<Report> {
		return (await this.db.insert(rpt).values(data).returning())[0];
	}

	async update(id: string, data: UpdateReportData): Promise<Report> {
		return (
			await this.db.update(rpt).set(data).where(eq(rpt.id, id)).returning()
		)[0];
	}

	async publish(id: string, by: string, pdfUrl: string): Promise<Report> {
		return (
			await this.db
				.update(rpt)
				.set({
					status: 'published',
					pdfUrl,
					publishedAt: new Date(),
					updatedBy: by,
				})
				.where(eq(rpt.id, id))
				.returning()
		)[0];
	}

	async softDelete(id: string): Promise<void> {
		await this.db
			.update(rpt)
			.set({ deletedAt: new Date() })
			.where(eq(rpt.id, id));
	}
	async permanentDelete(id: string) {
		await this.db.delete(rpt).where(eq(rpt.id, id));
	}

	async findById(id: string): Promise<Report | null> {
		const res = await this.db.query.report.findFirst({ where: eq(rpt.id, id) });
		return res ?? null;
	}

	async findAll(
		orgId: string,
		filters: ReportFilters,
		{ page, limit }: Pagination,
	) {
		const offset = (page - 1) * limit;

		const base = this.db.selectDistinct({ id: rpt.id }).from(rpt).$dynamic();

		const { query, conditions } = applyDynamicFilters(
			base,
			filters,
			undefined,
			filterConfig,
		);
		const ids = await (query as typeof base)
			.where(and(eq(rpt.organizationId, orgId), conditions))
			.limit(limit)
			.offset(offset);

		if (!ids.length) return [];
		return this.db.query.report.findMany({
			where: inArray(
				rpt.id,
				ids.map((r) => r.id),
			),
		});
	}

	async count(orgId: string, filters: ReportFilters) {
		const base = this.db
			.select({ c: sql<number>`count(distinct ${rpt.id})`.mapWith(Number) })
			.from(rpt)
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			base,
			filters,
			undefined,
			filterConfig,
		);
		const [{ c }] = await (query as typeof base).where(
			and(eq(rpt.organizationId, orgId), conditions),
		);
		return c;
	}
}
