import { PatientDocument } from '@/domain/entities/patient';
import { Pagination } from '@/domain/entities/pagination';

export type CreateDocumentData = Omit<
	PatientDocument,
	'id' | 'createdAt' | 'patientId' | 'updatedAt' | 'issuedAt' | 'expiresAt'
> & {
	patientId: string;
	issuedAt?: string;
	expiresAt?: string;
};

export type CreateDocumentDTO = Omit<CreateDocumentData, 'patientId'>;

export type UpdateDocumentData = Partial<CreateDocumentData>;

export type PatientDocumentRepository = {
	/**
	 * Creates multiple documents for a patient.
	 * @param patientId - The ID of the patient to create documents for.
	 * @param data - Array of document data to create.
	 * @returns Promise resolving to an array of created documents.
	 */
	create(
		patientId: string,
		data: CreateDocumentDTO[],
	): Promise<PatientDocument[]>;
	/**
	 * Updates an existing document.
	 * @param id - The ID of the document to update.
	 * @param data - The data to update the document with.
	 * @returns Promise resolving to the updated document.
	 */
	update(id: string, data: UpdateDocumentData): Promise<PatientDocument>;
	/**
	 * Deletes a document by its ID.
	 * @param id - The ID of the document to delete.
	 * @returns Promise that resolves when the document is deleted.
	 */
	delete(id: string): Promise<void>;
	/**
	 * Finds a document by its ID.
	 * @param id - The ID of the document to find.
	 * @returns Promise resolving to the document if found, undefined otherwise.
	 */
	findById(id: string): Promise<PatientDocument | undefined>;
	/**
	 * Finds all documents for a specific patient.
	 * @param patientId - The ID of the patient to find documents for.
	 * @param pagination - Optional pagination parameters for the results.
	 * @returns Promise resolving to an array of documents for the patient.
	 */
	findByPatient(
		patientId: string,
		pagination?: Pagination,
	): Promise<PatientDocument[]>;
	/**
	 * Synchronizes documents for a patient by replacing existing documents with new ones.
	 * @param patientId - The ID of the patient to sync documents for.
	 * @param documents - Array of document data to sync.
	 * @returns Promise resolving to an array of synchronized documents.
	 */
	syncDocuments(
		patientId: string,
		documents: CreateDocumentDTO[],
	): Promise<PatientDocument[]>;
};
