import { PrintMaskRepository } from '@/application/ports/out/print-mask-repository';
import { PrintMask } from '@/domain/entities/print-mask';

export class FindByIdPrintMaskUseCase {
	constructor(private readonly printMaskRepository: PrintMaskRepository) {}

	async execute(id: string): Promise<PrintMask | null> {
		return this.printMaskRepository.findById(id);
	}
}
