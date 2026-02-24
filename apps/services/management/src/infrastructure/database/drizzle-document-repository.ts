import { DbClientTransaction, patientDocument } from '@packages/data-access';
import { eq } from 'drizzle-orm';
import {
	CreateDocumentDTO,
	PatientDocumentRepository,
	UpdateDocumentData,
} from '@/application/ports/out/patient/document-repository';
import { Pagination } from '@/domain/entities/pagination';
import { PatientDocument } from '@/domain/entities/patient';
import { db as globalDb } from '../config/db';

export class DrizzleDocumentRepository implements PatientDocumentRepository {
	private readonly dbClient: DbClientTransaction | typeof globalDb;
	constructor(private readonly tx?: DbClientTransaction) {
		this.dbClient = this.tx ? this.tx : globalDb;
	}

	async create(
		patientId: string,
		data: CreateDocumentDTO[],
	): Promise<PatientDocument[]> {
		const result = await this.dbClient
			.insert(patientDocument)
			.values(
				data.map((d) => ({
					patientId: patientId,
					type: d.type,
					number: d.number,
					issuedAt: d.issuedAt ? new Date(d.issuedAt) : undefined,
					expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined,
				})),
			)
			.returning();
		return result as PatientDocument[];
	}

	async update(id: string, data: UpdateDocumentData): Promise<PatientDocument> {
		const [row] = await this.dbClient
			.update(patientDocument)
			.set({
				...data,
				issuedAt: data.issuedAt ? new Date(data.issuedAt) : undefined,
				expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
			})
			.where(eq(patientDocument.id, id))
			.returning();
		return row as PatientDocument;
	}

	async delete(id: string): Promise<void> {
		await this.dbClient
			.delete(patientDocument)
			.where(eq(patientDocument.id, id));
	}

	async findById(id: string): Promise<PatientDocument | undefined> {
		return this.dbClient.query.patientDocument.findFirst({
			where: eq(patientDocument.id, id),
		});
	}

	async findByPatient(
		patientId: string,
		pagination?: Pagination,
	): Promise<PatientDocument[]> {
		const limit = pagination?.limit ?? 100;
		const offset = ((pagination?.page ?? 1) - 1) * limit;

		return this.dbClient.query.patientDocument.findMany({
			where: eq(patientDocument.patientId, patientId),
			limit,
			offset,
		});
	}

	async syncDocuments(
		patientId: string,
		documents: CreateDocumentDTO[],
	): Promise<PatientDocument[]> {
		if (!documents.length) return [];
		return await this.dbClient.transaction(async (tx) => {
			// Fetch existing docs
			const existingDocs = await tx.query.patientDocument.findMany({
				where: eq(patientDocument.patientId, patientId),
			});
			const newDocs: PatientDocument[] = [];
			for (const doc of documents) {
				const existing = existingDocs.find((d) => d.type === doc.type);
				if (!existing) {
					const newDoc = await tx
						.insert(patientDocument)
						.values({
							patientId,
							...doc,
							issuedAt: doc.issuedAt ? new Date(doc.issuedAt) : undefined,
							expiresAt: doc.expiresAt ? new Date(doc.expiresAt) : undefined,
						})
						.returning();
					newDocs.push(...newDoc);
				} else if (existing.number !== doc.number) {
					const updatedDoc = await tx
						.update(patientDocument)
						.set({
							number: doc.number,
							issuedAt: doc.issuedAt
								? new Date(doc.issuedAt)
								: existing.issuedAt,
							expiresAt: doc.expiresAt
								? new Date(doc.expiresAt)
								: existing.expiresAt,
						})
						.where(eq(patientDocument.id, existing.id))
						.returning();
					newDocs.push(...updatedDoc);
				}
			}

			return newDocs;
		});
	}
}
