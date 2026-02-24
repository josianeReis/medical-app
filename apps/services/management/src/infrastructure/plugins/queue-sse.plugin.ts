import { Elysia, t } from 'elysia';
import { queueBus, QueueUpdatePayload } from './event-bus';

export function createQueueSSEPlugin() {
	return (app: Elysia) =>
		app.get(
			'/stream',
			({ params }) => {
				let send: (p: QueueUpdatePayload) => void;
				return new Response(
					new ReadableStream<Uint8Array>({
						start(controller) {
							send = (p: QueueUpdatePayload) => {
								if (params.roomId && p.roomId !== params.roomId) return;
								controller.enqueue(
									new TextEncoder().encode(`data: ${JSON.stringify(p)}\n\n`),
								);
							};
							queueBus.on('queue.update', send);
						},
						cancel() {
							if (send) queueBus.off('queue.update', send);
						},
					}),
					{
						headers: {
							'Content-Type': 'text/event-stream',
							'Cache-Control': 'no-cache',
							Connection: 'keep-alive',
							'Access-Control-Allow-Origin': '*',
						},
					},
				);
			},
			{
				params: t.Object({
					roomId: t.String(),
				}),
			},
		);
}
