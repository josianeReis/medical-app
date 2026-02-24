import { patient, patientDocument } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';
import { Address } from './address';
import { UserWithDetails } from './user';

export type PatientGender = 'M' | 'F' | 'O';

export type Patient = InferSelectModel<typeof patient> & {
	gender: PatientGender | null;
};
export type PatientDocument = InferSelectModel<typeof patientDocument>;

export type PatientWithDetails = Patient & {
	addresses: Address[];
	documents: PatientDocument[];
	user: UserWithDetails | null;
};
