import {
	CreateReportData,
	ReportRepository,
} from '@/application/ports/out/report-repository';
import { Report } from '@/domain/entities/report';

export class CreateReportUseCase {
	constructor(private readonly reportRepository: ReportRepository) {}

	async execute(data: CreateReportData): Promise<Report> {
		return this.reportRepository.create(data);
	}
}
