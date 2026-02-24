import { UnitOfWork } from '@/application/ports/out/unit-of-work';

type DeletePatientInput = {
	id: string;
	organizationId: string;
	deletedById: string;
};

export class SoftDeletePatientUseCase {
	constructor(
		private readonly runInTx: <T>(
			w: (u: UnitOfWork) => Promise<T>,
		) => Promise<T>,
	) {}

	async execute({
		id,
		organizationId,
		deletedById,
	}: DeletePatientInput): Promise<void> {
		await this.runInTx(async (uow) => {
			await uow.users.banUser(id, 'soft_deleted');
			await uow.members.softDelete(id, organizationId, deletedById);
		});
	}
}
