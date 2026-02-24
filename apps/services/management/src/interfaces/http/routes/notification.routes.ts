import { DrizzleOutboxRepository } from '@/infrastructure/database/drizzle-outbox.repository';
import Elysia from 'elysia';

const outboxRepo = new DrizzleOutboxRepository();

export const notificationRoutes = (app: Elysia) =>
	app.get('/notifications/stream', async ({ set }) => {
		set.headers['Content-Type'] = 'text/event-stream';
		set.headers['Cache-Control'] = 'no-cache';
		set.headers['Connection'] = 'keep-alive';

		const encoder = new TextEncoder();
		let interval: NodeJS.Timeout;
		const stream = new ReadableStream({
			async start(controller) {
				controller.enqueue(encoder.encode('retry: 10000\n\n'));
				interval = setInterval(async () => {
					const events = await outboxRepo.fetchPending(100);
					for (const ev of events) {
						controller.enqueue(
							encoder.encode(`data: ${JSON.stringify(ev)}\n\n`),
						);
						await outboxRepo.markProcessed(ev.id);
					}
				}, 2000);
			},
			cancel() {
				clearInterval(interval);
			},
		});
		return stream;
	});
