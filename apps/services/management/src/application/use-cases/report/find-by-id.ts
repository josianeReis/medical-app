import { ReportRepository } from '@/application/ports/out/report-repository';
import { Report } from '@/domain/entities/report';

export class FindByIdReportUseCase {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(id: string): Promise<Report | null> {
		return this.reportRepository.findById(id);
	}
}
