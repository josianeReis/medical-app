import { AddressRepository } from './patient/address-repository';
import { PatientRepository } from './patient/patient-repository';
import { PatientDocumentRepository } from './patient/document-repository';
import { MemberRepository } from './patient/member-repository';
import { UserRepository } from './patient/user-repository';

// Aggregate repositories under a single transaction boundary
export type UnitOfWork = {
	addresses: AddressRepository;
	patients: PatientRepository;
	documents: PatientDocumentRepository;
	members: MemberRepository;
	users: UserRepository;
};
