import { and, eq, inArray, or } from 'drizzle-orm';
import { DbClientTransaction, generateId, schema } from '..';

const ultrasoundCategoryTypes = [
	'Abdômen',
	'Mama',
	'Pélvica',
	'Transvaginal',
	'Tireoide',
	'Musculoesquelético',
	'Obstétrica',
	'Renal',
	'Próstata',
	'Morfológica',
];

const proceduresByCategory: Record<
	string,
	{ name: string; equipament: string }[]
> = {
	Abdômen: [
		{
			name: 'Ultrassom Abdômen Total',
			equipament: 'Sonda convexa de 3,5 MHz direcionada à região abdominal',
		},
		{
			name: 'Ultrassom Abdômen Superior',
			equipament:
				'Sonda convexa de 3,5 MHz focada em fígado, vesícula e pâncreas',
		},
		{
			name: 'Ultrassom Abdômen Inferior',
			equipament:
				'Sonda convexa de 3,5 MHz direcionada à região pélvica inferior',
		},
	],
	Mama: [
		{
			name: 'Ultrassom de Mama Unilateral',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz), direcionada à mama unilateral',
		},
		{
			name: 'Ultrassom de Mama Bilateral',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz), ambas as mamas',
		},
	],
	Pélvica: [
		{
			name: 'Ultrassom Pélvica Transabdominal',
			equipament:
				'Sonda convexa de 3,5 MHz através da parede abdominal inferior',
		},
	],
	Transvaginal: [
		{
			name: 'Ultrassom Transvaginal Simples',
			equipament: 'Sonda endocavitária de 6 a 9 MHz inserida via vaginal',
		},
		{
			name: 'Ultrassom Transvaginal com Doppler',
			equipament: 'Sonda endocavitária de 6 a 9 MHz com Doppler colorido',
		},
	],
	Tireoide: [
		{
			name: 'Ultrassom da Tireoide',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz) posicionada no pescoço',
		},
	],
	Musculoesquelético: [
		{
			name: 'Ultrassom de Ombro',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz), posicionada no ombro',
		},
		{
			name: 'Ultrassom de Joelho',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz), região anterior e posterior do joelho',
		},
		{
			name: 'Ultrassom de Cotovelo',
			equipament:
				'Sonda linear de alta frequência (7,5 a 10 MHz), posicionada no cotovelo',
		},
	],
	Obstétrica: [
		{
			name: 'Ultrassom Obstétrico 1º Trimestre',
			equipament:
				'Sonda convexa de 3,5 MHz, avaliação transabdominal do útero gestante',
		},
		{
			name: 'Ultrassom Obstétrico 2º Trimestre',
			equipament: 'Sonda convexa de 3,5 MHz, avaliação fetal transabdominal',
		},
	],
	Renal: [
		{
			name: 'Ultrassom Renal Simples',
			equipament:
				'Sonda convexa de 3,5 MHz, avaliação dos rins por via abdominal',
		},
		{
			name: 'Ultrassom Renal com Bexiga',
			equipament:
				'Sonda convexa de 3,5 MHz, avaliação dos rins e da bexiga cheia',
		},
	],
	Próstata: [
		{
			name: 'Ultrassom de Próstata via Abdominal',
			equipament:
				'Sonda convexa de 3,5 MHz, posicionada na região hipogástrica',
		},
		{
			name: 'Ultrassom de Próstata Transretal',
			equipament: 'Sonda endocavitária transretal de 6 a 9 MHz',
		},
	],
	Morfológica: [
		{
			name: 'Ultrassom Morfológica de 1º Trimestre',
			equipament:
				'Sonda convexa de 3,5 MHz, avaliação fetal precoce transabdominal',
		},
		{
			name: 'Ultrassom Morfológica de 2º Trimestre',
			equipament:
				'Sonda convexa de 3,5 MHz, avaliação detalhada da anatomia fetal',
		},
	],
};

export async function seedUltrasoundCategories(db: DbClientTransaction) {
	const categories = await db
		.insert(schema.category)
		.values(
			ultrasoundCategoryTypes.map((name) => ({
				id: generateId(),
				name,
			})),
		)
		.onConflictDoNothing({ target: [schema.category.name] })
		.returning();

	console.log('✅ Vereificação e inserção de categorias concluídas.');
	return categories;
}

const abdomenSubcategoryTypes = [
	'Abdômen Total Femino',
	'Abdômen Total Masculino',
	'Abdômen Parcial',
];

export async function seedAbdomenSubcategories(db: DbClientTransaction) {
	const [parent] = await db
		.select({ id: schema.category.id })
		.from(schema.category)
		.where(eq(schema.category.name, 'Abdômen'));

	if (!parent) {
		console.warn(
			"⚠️ Categoria 'Abdômen' não encontrada. Pulando subcategorias.",
		);
		return [];
	}

	const inserted = await db
		.insert(schema.category)
		.values(
			abdomenSubcategoryTypes.map((name) => ({
				id: generateId(),
				name,
			})),
		)
		.onConflictDoNothing({ target: [schema.category.name] })
		.returning();

	console.log('✅ Subcategorias de Abdômen inseridas.');
	return inserted;
}

export async function seedProcedures(
	db: DbClientTransaction,
	categories: (typeof schema.category.$inferSelect)[],
	organizationId: string,
) {
	const existingCategories =
		categories ?? (await db.select().from(schema.category));

	const categoryByName = new Map(
		existingCategories.map((cat) => [cat.name, cat.id]),
	);

	const proceduresList = Object.entries(proceduresByCategory)
		.flatMap(([categoryName, procedures]) =>
			(procedures ?? []).map((procedure) => ({
				...procedure,
				id: generateId(),
				categoryId: categoryByName.get(categoryName),
			})),
		)
		.filter((p) => p.categoryId);

	const existingProcedures = await db
		.select({ id: schema.procedure.id, name: schema.procedure.name })
		.from(schema.procedure)
		.where(
			inArray(
				schema.procedure.name,
				proceduresList.map((p) => p.name),
			),
		);

	const existingProcedureNames = new Set(existingProcedures.map((p) => p.name));

	const proceduresToInsert = proceduresList
		.filter((p) => !existingProcedureNames.has(p.name))
		.map((p) => ({
			id: p.id,
			name: p.name,
			code: null,
			duration: null,
			equipament: p.equipament,
			organizationId: organizationId
		}));

	if (proceduresToInsert.length > 0) {
		await db.insert(schema.procedure).values(proceduresToInsert);
	}

	const allProcedures = await db
		.select({ id: schema.procedure.id, name: schema.procedure.name })
		.from(schema.procedure)
		.where(
			inArray(
				schema.procedure.name,
				proceduresList.map((p) => p.name),
			),
		);

	const nameToId = new Map(allProcedures.map((p) => [p.name, p.id]));

	const procedureCategoryLinks = proceduresList.map((p) => ({
		procedureId: nameToId.get(p.name)!,
		categoryId: p.categoryId!,
	}));

	const existingLinks = await db
		.select({
			procedureId: schema.procedureCategories.procedureId,
			categoryId: schema.procedureCategories.categoryId,
		})
		.from(schema.procedureCategories)
		.where(
			or(
				...procedureCategoryLinks.map((link) =>
					and(
						eq(schema.procedureCategories.procedureId, link.procedureId),
						eq(schema.procedureCategories.categoryId, link.categoryId),
					),
				),
			),
		);

	const existingSet = new Set(
		existingLinks.map((link) => `${link.procedureId}-${link.categoryId}`),
	);

	const linksToInsert = procedureCategoryLinks.filter(
		(link) => !existingSet.has(`${link.procedureId}-${link.categoryId}`),
	);

	if (linksToInsert.length > 0) {
		await db.insert(schema.procedureCategories).values(linksToInsert);
	}

	console.log('✅ Procedimentos verificados e associados com sucesso.');
}
