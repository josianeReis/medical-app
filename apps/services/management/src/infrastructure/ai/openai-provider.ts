import { LlmProvider } from '@/application/ports/out/llm/llm-provider';
import { env } from '../config/env';

export class OpenAiProvider implements LlmProvider {
	constructor(
		private readonly apiKey: string = env.OPENAI_API_KEY,
		private readonly model = 'gpt-3.5-turbo',
	) {}

	async chat(
		prompt: string,
		options: Record<string, unknown> = {},
	): Promise<string> {
		const body = {
			model: options.model ?? this.model,
			messages: [{ role: 'user', content: prompt }],
			temperature: options.temperature ?? 0.7,
		};

		const res = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.apiKey}`,
			},
			body: JSON.stringify(body),
		});

		if (!res.ok) throw new Error('OpenAI request failed');
		const json = (await res.json()) as {
			choices: { message: { content: string } }[];
		};
		return json.choices?.[0]?.message?.content ?? '';
	}
}
