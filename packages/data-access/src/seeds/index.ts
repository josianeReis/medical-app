import { getDbClient } from '..';
import { env } from '../env';
import {
	seedAbdomenSubcategories,
	seedProcedures,
	seedUltrasoundCategories,
} from './create-categories';
import { seedAdminUser, seedOrganization } from './create-user';
import { seedRooms } from './create-rooms';
import { seedTemplates } from './create-templates';

async function main() {
	try {
		console.log('🚀 Iniciando seed de admin...');
		const db = getDbClient(env.DB_URL);
		await db.transaction(async (tx) => {
			const userId = await seedAdminUser(tx);

			console.log('🚀 Iniciando seed de organização...');
			const organizationId = await seedOrganization(tx, userId);

			console.log('\n🚀 Iniciando seed de salas padrão...');
			await seedRooms(tx, organizationId);

			console.log('\n🚀 Iniciando seed de categorias de ultrassom...');
			const categories = await seedUltrasoundCategories(tx);

			console.log('\n🚀 Iniciando seed de subcategorias de abdomen...');
			await seedAbdomenSubcategories(tx);

			console.log('\n🚀 Iniciando seed de procedimentos...');
			await seedProcedures(tx, categories, organizationId);

			console.log('\n🚀 Iniciando seed de templates...');
			await seedTemplates(tx, organizationId);

			console.log('\n🎉 Seed completo com sucesso!');
		});
		process.exit(0);
	} catch (error) {
		console.error('❌ Erro durante o processo de seed:', error);
		process.exit(1);
	}
}

main();
