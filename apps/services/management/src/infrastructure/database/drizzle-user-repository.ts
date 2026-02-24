import {
	CreateUserDTO,
	CreateUserResponse,
	UserFilters,
	UserRepository,
} from '@/application/ports/out/patient/user-repository';
import { Pagination } from '@/domain/entities/pagination';
import { User } from '@/domain/entities/user';
import { db as globalDb } from '../config/db';
import { DbClientTransaction, schema } from '@packages/data-access';
import { and, eq } from 'drizzle-orm';
import { getWhereConditions } from '@packages/utils/db/get-where-conditions';
import { generateId } from '@packages/data-access';
import { BadRequestError } from '@/domain/errors/bad-request-error';

export class DrizzleUserRepository implements UserRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}
	async banUser(id: string, banReason: string): Promise<User | null> {
		const [user] = await this.dbClient
			.update(schema.user)
			.set({
				banned: true,
				banReason,
			})
			.where(eq(schema.user.id, id))
			.returning();
		return user || null;
	}

	async softDelete(id: string, _deletedBy: string): Promise<User | null> {
		const [user] = await this.dbClient
			.update(schema.user)
			.set({
				banned: true,
				banReason: 'soft_deleted',
				deletedAt: new Date(),
			})
			.where(eq(schema.user.id, id))
			.returning();
		return user || null;
	}

	async findById(id: string): Promise<User | null> {
		const data = await this.dbClient
			.select()
			.from(schema.user)
			.where(eq(schema.user.id, id))
			.limit(1);

		return data[0] || null;
	}
	async findByEmail(email: string): Promise<User | null> {
		const data = await this.dbClient
			.select()
			.from(schema.user)
			.where(eq(schema.user.email, email))
			.limit(1);
		return data[0] || null;
	}
	async findAll(
		organizationId: string,
		filters: UserFilters,
		pagination: Pagination,
	): Promise<User[]> {
		const whereConditions = getWhereConditions(schema.user, filters, [
			eq(schema.member.organizationId, organizationId),
		]);
		const data = await this.dbClient
			.select()
			.from(schema.user)
			.leftJoin(schema.member, eq(schema.user.id, schema.member.userId))
			.where(and(...whereConditions))
			.limit(pagination.limit)
			.offset(pagination.page);
		return data.map((data) => data.user);
	}

	async create(data: CreateUserDTO): Promise<CreateUserResponse> {
		try {
			const id = generateId();

			const result = await this.dbClient
				.insert(schema.user)
				.values({
					id,
					email: data.email,
					username: data.username,
					name: data.name,
					firstName: data.firstName,
					lastName: data.lastName,
					terms: data.terms,
				})
				.returning();

			if (!result.at(0)?.id)
				throw new BadRequestError('errors.failed_to_create_user');

			return { data: { user: result.at(0) as User } };
		} catch (error) {
			return { error };
		}
	}
}
