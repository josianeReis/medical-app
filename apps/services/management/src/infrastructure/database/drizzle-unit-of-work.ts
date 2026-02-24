import { AddressRepository } from '@/application/ports/out/patient/address-repository';
import { PatientDocumentRepository } from '@/application/ports/out/patient/document-repository';
import { MemberRepository } from '@/application/ports/out/patient/member-repository';
import { PatientRepository } from '@/application/ports/out/patient/patient-repository';
import { UnitOfWork } from '@/application/ports/out/unit-of-work';
import { UserRepository } from '@/application/ports/out/patient/user-repository';
import { DrizzleAddressRepository } from './drizzle-address-repository';
import { DrizzleDocumentRepository } from './drizzle-document-repository';
import { DrizzleMemberRepository } from './drizzle-member-repository';
import { DrizzlePatientRepository } from './drizzle-patient-repository';
import { DrizzleUserRepository } from './drizzle-user-repository';
import { DbClientTransaction } from '@packages/data-access';

export class DrizzleUnitOfWork implements UnitOfWork {
	addresses: AddressRepository;
	patients: PatientRepository;
	documents: PatientDocumentRepository;
	members: MemberRepository;
	users: UserRepository;

	constructor(private readonly tx: DbClientTransaction) {
		// In the future tx will be a transaction object; for now reuse global db
		this.addresses = new DrizzleAddressRepository(this.tx);
		this.patients = new DrizzlePatientRepository(this.tx);
		this.documents = new DrizzleDocumentRepository(this.tx);
		this.members = new DrizzleMemberRepository(this.tx);
		this.users = new DrizzleUserRepository(this.tx);
	}
}
