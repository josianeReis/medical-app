import { DrizzleProcedureRepository } from '../../../infrastructure/database/drizzle-procedure.repository';

import { FindByIdProcedureUseCase } from '../procedure/find-by-id';

const procedureRepository = new DrizzleProcedureRepository();

// TODO: solução temporaria, apenas pra teste
type generateData = {
	name: string;
	procedureId: string;
	equipament?: string | null;
	templateID?: string | null;
};

export class AIUseCase {
	// constructor(private readonly reportRepository: ReportRepository) {}

	async execute(data: generateData): Promise<{
		result: string;
	}> {
		//TODO: substituir pelo templateId, porque ele vai conter essas informações do exame
		const useCase = new FindByIdProcedureUseCase(procedureRepository);
		const procedure = await useCase.execute(data.procedureId);

		const prompt = `Você é um médico radiologista. Com base nas informações abaixo, 
        gere um laudo médico completo e detalhado para o seguinte exame:
        Tipo de exame: ${procedure?.name}
        Indicação: {indication}
        Técnica: ${data.equipament ?? procedure?.equipament}
        Achados: {"; ".join(findings)}
        Conclusão: {conclusion}
        Siga a estrutura comum de laudos clínicos:
        Cabeçalho do exame
        Corpo do laudo com linguagem médica
        Conclusão destacada
        Assinatura e matrícula médica simuladas
        Laudo:`;

		const response = await fetch(
			'https://xwoef2ezbxd1xw-8000.proxy.runpod.net/generate',
			{
				method: 'POST',
				body: JSON.stringify({ prompt }),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const { result } = (await response.json()) as { result: string };

		return {
			result: result,
		};
	}
}
