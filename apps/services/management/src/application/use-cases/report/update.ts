import {
	UpdateReportData,
	ReportRepository,
} from '@/application/ports/out/report-repository';
import { Report } from '@/domain/entities/report';

export class UpdateReportUseCase {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(id: string, data: UpdateReportData): Promise<Report> {
		return this.reportRepository.update(id, data);
	}
}
