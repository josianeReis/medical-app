import {
	CreatePrintMaskData,
	PrintMaskRepository,
} from '@/application/ports/out/print-mask-repository';
import { PrintMask } from '@/domain/entities/print-mask';

export class CreatePrintMaskUseCase {
	constructor(private readonly printMaskRepository: PrintMaskRepository) {}

	async execute(data: CreatePrintMaskData): Promise<PrintMask> {
		return this.printMaskRepository.create(data);
	}
}
