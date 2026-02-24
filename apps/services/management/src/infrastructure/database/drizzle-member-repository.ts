import { schema, generateId, DbClientTransaction } from '@packages/data-access';
import { and, eq } from 'drizzle-orm';
import { MemberRepository } from '@/application/ports/out/patient/member-repository';
import { MemberWithDetails } from '@/domain/entities/member';
import { db as globalDb } from '@/infrastructure/config/db';

export class DrizzleMemberRepository implements MemberRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}
	async findByUserId(userId: string): Promise<MemberWithDetails | undefined> {
		const member = await this.dbClient.query.member.findFirst({
			where: eq(schema.member.userId, userId),
			with: {
				organization: true,
			},
		});

		return member;
	}

	async findByOrganizationId(
		organizationId: string,
	): Promise<MemberWithDetails[]> {
		const members = await this.dbClient.query.member.findMany({
			where: eq(schema.member.organizationId, organizationId),
			with: {
				organization: true,
			},
		});

		return members;
	}

	async addToOrganization(
		userId: string,
		organizationId: string,
		role: string = 'patient',
	): Promise<void> {
		await this.dbClient
			.insert(schema.member)
			.values({
				id: generateId(),
				userId,
				organizationId,
				role,
			})
			.returning();
	}

	async softDelete(
		userId: string,
		organizationId: string,
		deletedBy: string,
	): Promise<void> {
		await this.dbClient
			.update(schema.member)
			.set({
				deletedAt: new Date(),
				deletedBy,
			})
			.where(
				and(
					eq(schema.member.userId, userId),
					eq(schema.member.organizationId, organizationId),
				),
			)
			.returning();
	}

	async updateMemberRole(
		userId: string,
		organizationId: string,
		role: string,
	): Promise<void> {
		await this.dbClient
			.update(schema.member)
			.set({ role })
			.where(
				and(
					eq(schema.member.userId, userId),
					eq(schema.member.organizationId, organizationId),
				),
			)
			.returning();
	}

	async findByUserAndOrganization(
		userId: string,
		organizationId: string,
	): Promise<MemberWithDetails | undefined> {
		const member = await this.dbClient.query.member.findFirst({
			where: and(
				eq(schema.member.userId, userId),
				eq(schema.member.organizationId, organizationId),
			),
			with: {
				organization: true,
			},
		});

		return member;
	}
}
