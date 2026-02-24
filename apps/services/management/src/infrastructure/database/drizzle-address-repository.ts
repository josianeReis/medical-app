import {
	AddressRepository,
	CreateAddressDTO,
	UpdateAddressData,
} from '@/application/ports/out/patient/address-repository';
import { Address } from '@/domain/entities/address';
import { Pagination } from '@/domain/entities/pagination';
import { db as globalDb } from '../config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { eq } from 'drizzle-orm';

export class DrizzleAddressRepository implements AddressRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(
		patientId: string,
		data: CreateAddressDTO[],
	): Promise<Address[]> {
		const result = await this.dbClient
			.insert(schema.address)
			.values(
				data.map((d) => ({
					patientId,
					...d,
				})),
			)
			.returning();
		return result;
	}

	async update(id: string, data: UpdateAddressData): Promise<Address> {
		const [row] = await this.dbClient
			.update(schema.address)
			.set({ ...data })
			.where(eq(schema.address.id, id))
			.returning();
		return row as Address;
	}

	async delete(id: string): Promise<void> {
		await this.dbClient.delete(schema.address).where(eq(schema.address.id, id));
	}

	async findById(id: string): Promise<Address | undefined> {
		return this.dbClient.query.address.findFirst({
			where: eq(schema.address.id, id),
		});
	}

	async findByPatient(
		patientId: string,
		pagination?: Pagination,
	): Promise<Address[]> {
		const limit = pagination?.limit ?? 100;
		const offset = ((pagination?.page ?? 1) - 1) * limit;

		return this.dbClient.query.address.findMany({
			where: eq(schema.address.patientId, patientId),
			limit,
			offset,
		});
	}
}
