import {
	CreatePatientData,
	PatientRepository,
	UpdatePatientData,
} from '@/application/ports/out/patient/patient-repository';
import { Pagination } from '@/domain/entities/pagination';
import { PatientWithDetails } from '@/domain/entities/patient';
import { NotFoundError } from '@/domain/errors/not-found-error';
import { DbClientTransaction, schema } from '@packages/data-access';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { db as globalDb } from '../config/db';
import {
	applyDynamicFilters,
	DynamicFilterConfig,
	Filter,
} from '@packages/utils';

const patientFilterConfig: DynamicFilterConfig = {
	primaryTable: 'patient',
	schemaMap: {
		patient: schema.patient,
		user: schema.user,
		documents: schema.patientDocument,
	},
	joinMap: {
		user: {
			on: eq(schema.patient.id, schema.user.id),
			table: schema.user,
		},
		documents: {
			on: eq(schema.patient.id, schema.patientDocument.patientId),
			table: schema.patientDocument,
		},
	},
};

export class DrizzlePatientRepository implements PatientRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(
		createdBy: string,
		userId: string,
		data: CreatePatientData,
	): Promise<PatientWithDetails> {
		const result = await this.dbClient
			.insert(schema.patient)
			.values({ ...data, createdBy, id: userId })
			.returning();

		const patient = await this.findById(result[0].id);
		if (!patient) throw new NotFoundError('errors.patient_not_found');
		return patient;
	}

	async findById(id: string): Promise<PatientWithDetails | undefined> {
		const patient = await this.dbClient.query.patient.findFirst({
			where: eq(schema.patient.id, id),
			with: {
				addresses: true,
				documents: true,
				user: {
					with: {
						members: {
							with: {
								organization: true,
							},
						},
					},
				},
			},
		});

		return patient;
	}

	async findByPhoneNumber(
		phoneNumber: string,
	): Promise<PatientWithDetails | undefined> {
		const patient = await this.dbClient.query.patient.findFirst({
			where: eq(schema.patient.phoneNumber, phoneNumber),
			with: {
				addresses: true,
				documents: true,
				user: {
					with: {
						members: {
							with: {
								organization: true,
							},
						},
					},
				},
			},
		});
		return patient;
	}

	async findByEmail(email: string): Promise<PatientWithDetails | undefined> {
		const patient = await this.dbClient.query.patient.findFirst({
			where: eq(schema.patient.email, email),
			with: {
				addresses: true,
				documents: true,
				user: {
					with: {
						members: {
							with: {
								organization: true,
							},
						},
					},
				},
			},
		});
		return patient;
	}

	async findAll(
		organizationId: string,
		filters: Filter[],
		pagination: Pagination,
		sort?: string,
	): Promise<PatientWithDetails[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		const baseQuery = this.dbClient
			.selectDistinct({ id: schema.patient.id })
			.from(schema.patient)
			.leftJoin(schema.member, eq(schema.member.userId, schema.patient.id))
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			sort,
			patientFilterConfig,
		);

		const organizationCondition = eq(
			schema.member.organizationId,
			organizationId,
		);

		const finalConditions = and(organizationCondition, conditions);

		const patientIds = await (query as typeof baseQuery)
			.where(finalConditions)
			.limit(limit)
			.offset(offset);

		if (patientIds.length === 0) {
			return [];
		}

		const patients = await this.dbClient.query.patient.findMany({
			where: inArray(
				schema.patient.id,
				patientIds.map((p) => p.id),
			),
			with: {
				user: {
					with: {
						members: {
							where: eq(schema.member.organizationId, organizationId),
							with: {
								organization: true,
							},
						},
					},
				},
				documents: true,
				addresses: true,
			},
		});
		return patients;
	}

	async count(organizationId: string, filters: Filter[]): Promise<number> {
		const baseQuery = this.dbClient
			.select({
				count: sql<number>`count(distinct ${schema.patient.id})`.mapWith(
					Number,
				),
			})
			.from(schema.patient)
			.leftJoin(schema.member, eq(schema.member.userId, schema.patient.id))
			.$dynamic();

		const { query, conditions } = applyDynamicFilters(
			baseQuery,
			filters,
			undefined, // Sorting is not needed for count
			patientFilterConfig,
		);

		const organizationCondition = eq(
			schema.member.organizationId,
			organizationId,
		);

		const finalConditions = and(organizationCondition, conditions);

		const result = await (query as typeof baseQuery).where(finalConditions);

		return result[0].count;
	}

	async update(
		id: string,
		data: UpdatePatientData,
	): Promise<PatientWithDetails> {
		const [patient] = await this.dbClient
			.update(schema.patient)
			.set(data)
			.where(eq(schema.patient.id, id))
			.returning();
		return (await this.findById(patient.id))!;
	}

	async softDelete(id: string, deletedBy: string): Promise<void> {
		await this.dbClient
			.update(schema.patient)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(eq(schema.patient.id, id))
			.returning();
	}

	async findByDocumentAndBirthdate(): Promise<PatientWithDetails | null> {
		return null;
	}
}
