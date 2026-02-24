import { generateId } from '../utils';
import { DbClientTransaction, getDbClient, schema } from '..';
import { env } from '../env';
import { eq } from 'drizzle-orm';

export const db = getDbClient(env.DB_URL);

export async function seedAdminUser(db: DbClientTransaction) {
	const [existingUser] = await db
		.select()
		.from(schema.user)
		.where(eq(schema.user.email, 'admin@nexdoc.clinic'));

	if (existingUser) {
		console.log('ℹ️ Usuário admin já existe. Nenhuma ação necessária.');
		return existingUser.id;
	}

	const userId = generateId();

	await db
		.insert(schema.user)
		.values({
			id: userId,
			name: 'User Admin',
			firstName: 'User',
			lastName: 'Admin',
			email: 'admin@nexdoc.clinic',
			emailVerified: true,
			username: 'useradmin',
			displayUsername: 'useradmin',
			role: 'admin',
			language: 'pt',
			terms: true,
		})
		.onConflictDoNothing({ target: [schema.user.email] })
		.returning();

	await db.insert(schema.account).values({
		id: generateId(),
		accountId: userId,
		providerId: 'credential',
		userId,
		password:
			'd0f9dc02e64fa7a9d7295350cad5a8b9:62596fc0c4063bd144205f16eb7b92f91ac80b0a4ba8f3dc53c5ab92d87a5dcaae364a1c9c21263d4b8f63cb6ee8dd027fe4b8a4c6251dd3a440985e049b6ebd',
	});

	console.log('✅ Usuário criado com sucesso!');

	return userId;
}

export async function seedOrganization(
	db: DbClientTransaction,
	userId: string,
) {
	const organizationId = generateId();

	const [existingOrganization] = await db
		.select()
		.from(schema.organization)
		.where(eq(schema.organization.slug, 'nexdoc'));

	if (existingOrganization) {
		console.log('ℹ️ Organização já existe. Nenhuma ação necessária.');
		return existingOrganization.id;
	}

	await db
		.insert(schema.organization)
		.values({
			id: organizationId,
			name: 'Nexdoc',
			slug: 'nexdoc',
		})
		.returning();

	await db
		.insert(schema.member)
		.values({
			id: generateId(),
			organizationId,
			userId,
			role: 'owner',
		})
		.returning();

	console.log('✅ Organization Nexdoc criados com sucesso!');
	return organizationId
}
