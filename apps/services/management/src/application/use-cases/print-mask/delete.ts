import { PrintMaskRepository } from '@/application/ports/out/print-mask-repository';

export class DeletePrintMaskUseCase {
	constructor(private readonly printMaskRepository: PrintMaskRepository) {}

	async execute(id: string, deletedBy: string): Promise<void> {
		return this.printMaskRepository.softDelete(id, deletedBy);
	}
}
