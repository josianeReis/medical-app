/*
 * Drizzle implementation of AppointmentRepository
 * NOTE: This is only a scaffold. The implementation should be completed
 * once the appointments table and related indexes are created.
 */
import {
	AppointmentRepository,
	CreateAppointmentData,
	ListAppointmentsFilters,
	UpdateAppointmentData,
} from '@/application/ports/out/appointment-repository';
import { Appointment } from '@/domain/entities/appointment';
import { Pagination } from '@/domain/entities/pagination';
import { db as globalDb } from '@/infrastructure/config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { and, asc, between, desc, eq, gt, lt, sql } from 'drizzle-orm';

export class DrizzleAppointmentRepository implements AppointmentRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(data: CreateAppointmentData): Promise<Appointment> {
		const [row] = await this.dbClient
			.insert(schema.appointment)
			.values({
				...data,
				status: data.status ?? 'SCHEDULED',
			})
			.returning();
		return row;
	}

	async update(
		id: string,
		data: UpdateAppointmentData,
	): Promise<Appointment | null> {
		const [row] = await this.dbClient
			.update(schema.appointment)
			.set({ ...data })
			.where(eq(schema.appointment.id, id))
			.returning();
		return row ?? null;
	}

	async delete(id: string): Promise<void> {
		await this.dbClient
			.delete(schema.appointment)
			.where(eq(schema.appointment.id, id));
	}

	async findById(id: string): Promise<Appointment | null> {
		return (
			(await this.dbClient.query.appointment.findFirst({
				where: eq(schema.appointment.id, id),
			})) ?? null
		);
	}

	async findAll(
		organizationId: string,
		filters: ListAppointmentsFilters,
		pagination: Pagination,
		sort?: string,
	): Promise<Appointment[]> {
		const { page, limit } = pagination;
		const offset = (page - 1) * limit;

		let orderBy = asc(schema.appointment.start);
		if (sort) {
			const [field, direction] = sort.split(':');
			if (field === 'start') {
				orderBy =
					direction === 'desc'
						? desc(schema.appointment.start)
						: asc(schema.appointment.start);
			}
		}

		const conditions = [eq(schema.appointment.organizationId, organizationId)];

		if (filters.roomId) {
			conditions.push(eq(schema.appointment.roomId, filters.roomId));
		}
		if (filters.doctorId) {
			conditions.push(eq(schema.appointment.doctorId, filters.doctorId));
		}
		if (filters.from && filters.to) {
			conditions.push(
				between(schema.appointment.start, filters.from, filters.to),
			);
		} else if (filters.from) {
			conditions.push(gt(schema.appointment.start, filters.from));
		} else if (filters.to) {
			conditions.push(lt(schema.appointment.start, filters.to));
		}

		return await this.dbClient
			.select()
			.from(schema.appointment)
			.where(and(...conditions))
			.orderBy(orderBy)
			.limit(limit)
			.offset(offset);
	}

	async count(
		organizationId: string,
		filters: ListAppointmentsFilters,
	): Promise<number> {
		const conditions = [eq(schema.appointment.organizationId, organizationId)];
		if (filters.roomId) {
			conditions.push(eq(schema.appointment.roomId, filters.roomId));
		}
		if (filters.doctorId) {
			conditions.push(eq(schema.appointment.doctorId, filters.doctorId));
		}
		if (filters.from && filters.to) {
			conditions.push(
				between(schema.appointment.start, filters.from, filters.to),
			);
		} else if (filters.from) {
			conditions.push(gt(schema.appointment.start, filters.from));
		} else if (filters.to) {
			conditions.push(lt(schema.appointment.start, filters.to));
		}

		const result = await this.dbClient
			.select({ count: sql<number>`count(*)`.mapWith(Number) })
			.from(schema.appointment)
			.where(and(...conditions));
		return Number(result[0]?.count ?? 0);
	}

	async findRecurringParents(organizationId: string): Promise<Appointment[]> {
		return this.dbClient
			.select()
			.from(schema.appointment)
			.where(
				and(
					eq(schema.appointment.organizationId, organizationId),
					sql`${schema.appointment.recurrenceRule} IS NOT NULL`,
					sql`${schema.appointment.seriesId} IS NULL`,
				),
			);
	}
}
