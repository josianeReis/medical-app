import { OutboxRepository } from '@/application/ports/out/outbox-repository';
import { ReportRepository } from '@/application/ports/out/report-repository';
import { Report } from '@/domain/entities/report';

export class PublishReportUseCase {
	constructor(
		private readonly reportRepository: ReportRepository,
		private readonly outbox: OutboxRepository,
	) {}

	async execute(
		id: string,
		publishedBy: string,
		pdfUrl: string,
	): Promise<Report> {
		// run in single transaction via db transaction helper

		const report = await this.reportRepository.publish(id, publishedBy, pdfUrl);
		await this.outbox.enqueue({
			aggregateId: report.id,
			aggregateType: 'Report',
			eventType: 'ReportPublished',
			payload: JSON.stringify({
				reportId: report.id,
				organizationId: report.organizationId,
			}),
		});
		return report;
	}
}
