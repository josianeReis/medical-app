import { DbClientTransaction, schema } from '@packages/data-access';
import { generateId } from '../utils';

export async function seedRooms(
	tx: DbClientTransaction,
	organizationId: string,
) {
	const defaultRooms = ['Room 1', 'Room 2', 'Room 3'];
	const inserted = [] as string[];

	for (const name of defaultRooms) {
		const [room] = await tx
			.insert(schema.room)
			.values({
				id: generateId(),
				organizationId,
				name,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning({ id: schema.room.id });
		inserted.push(room.id);
	}
	return inserted;
}