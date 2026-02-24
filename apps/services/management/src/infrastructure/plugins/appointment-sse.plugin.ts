import { Elysia } from 'elysia';
import { queueBus, AppointmentEventPayload } from './event-bus';

export function createAppointmentSSEPlugin() {
	return (app: Elysia) =>
		app.get('/stream', () => {
			let send: (p: AppointmentEventPayload) => void;
			return new Response(
				new ReadableStream<Uint8Array>({
					start(controller) {
						send = (p: AppointmentEventPayload) => {
							controller.enqueue(
								new TextEncoder().encode(`data: ${JSON.stringify(p)}\n\n`),
							);
						};
						queueBus.on('appointment.update', send);
					},
					cancel() {
						if (send) queueBus.off('appointment.update', send);
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
		});
}
