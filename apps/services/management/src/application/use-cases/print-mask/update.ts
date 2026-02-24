import {
	UpdatePrintMaskData,
	PrintMaskRepository,
} from '@/application/ports/out/print-mask-repository';
import { PrintMask } from '@/domain/entities/print-mask';

export class UpdatePrintMaskUseCase {
	constructor(private readonly printMaskRepository: PrintMaskRepository) {}

	async execute(id: string, data: UpdatePrintMaskData): Promise<PrintMask> {
		return this.printMaskRepository.update(id, data);
	}
}
