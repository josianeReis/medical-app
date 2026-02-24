import Elysia from 'elysia';
import {
	roomIdModel,
	queueEntryIdModel,
	checkInModel,
	updatePriorityModel,
	transferModel,
} from '@/application/ports/in/queue-model';
import { CheckInUseCase } from '@/application/use-cases/queue/check-in';
import { CallNextPatientUseCase } from '@/application/use-cases/queue/call-next';
import { RecallPatientUseCase } from '@/application/use-cases/queue/recall-patient';
import { SkipPatientUseCase } from '@/application/use-cases/queue/skip-patient';
import { FinishAttendanceUseCase } from '@/application/use-cases/queue/finish-attendance';
import { TransferPatientUseCase } from '@/application/use-cases/queue/transfer-patient';
import { UpdatePriorityUseCase } from '@/application/use-cases/queue/update-priority';
import { wrapResponse } from '@/infrastructure/plugins/response-envelope-plugin';
import { createAuthMacroPlugin } from '@/infrastructure/plugins/auth-macro-plugin';
import { DrizzleQueueEntryRepository } from '@/infrastructure/database/drizzle-queue-entry.repository';
import { createQueueSSEPlugin } from '@/infrastructure/plugins/queue-sse.plugin';

const queueRepository = new DrizzleQueueEntryRepository(); // TODO implement repository

export const queueRoutes = (app: Elysia) =>
	app.group('/rooms/:roomId/queue', (app) =>
		app
			.use(createAuthMacroPlugin())
			.use(createQueueSSEPlugin())
			// List queue for room
			.get(
				'/',
				async ({ params }) => {
					const entries = await queueRepository.findWaitingByRoom(
						params.roomId,
					);
					return wrapResponse({ data: entries, error: null });
				},
				{
					auth: 'queue:read',
					params: roomIdModel,
				},
			)
			// Check in patient
			.post(
				'/check-in',
				async ({ params, body }) => {
					const checkInUC = new CheckInUseCase(queueRepository);
					const result = await checkInUC.execute({
						...body,
						roomId: params.roomId,
						state: 'WAITING',
						createdAt: new Date(),
						updatedAt: new Date(),
					});
					return wrapResponse(result);
				},
				{
					auth: 'queue:create',
					params: roomIdModel,
					body: checkInModel,
				},
			)
			// Call next patient
			.post(
				'/call',
				async ({ params }) => {
					const callNextUC = new CallNextPatientUseCase(queueRepository);
					const result = await callNextUC.execute({ roomId: params.roomId });
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: roomIdModel,
				},
			)
			// Recall patient
			.post(
				'/:entryId/recall',
				async ({ params }) => {
					const uc = new RecallPatientUseCase(queueRepository);
					const result = await uc.execute({ entryId: params.entryId });
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: queueEntryIdModel,
				},
			)
			// Skip patient
			.post(
				'/:entryId/skip',
				async ({ params }) => {
					const uc = new SkipPatientUseCase(queueRepository);
					const result = await uc.execute({ entryId: params.entryId });
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: queueEntryIdModel,
				},
			)
			// Finish patient
			.post(
				'/:entryId/finish',
				async ({ params }) => {
					const uc = new FinishAttendanceUseCase(queueRepository);
					const result = await uc.execute({ entryId: params.entryId });
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: queueEntryIdModel,
				},
			)
			// Transfer patient
			.post(
				'/:entryId/transfer',
				async ({ params, body }) => {
					const uc = new TransferPatientUseCase(queueRepository);
					const result = await uc.execute({
						entryId: params.entryId,
						targetRoomId: body.targetRoomId,
					});
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: queueEntryIdModel,
					body: transferModel,
				},
			)
			// Update priority
			.patch(
				'/:entryId/priority',
				async ({ params, body }) => {
					const uc = new UpdatePriorityUseCase(queueRepository);
					const result = await uc.execute({
						entryId: params.entryId,
						priority: body.priority,
					});
					return wrapResponse(result);
				},
				{
					auth: 'queue:update',
					params: queueEntryIdModel,
					body: updatePriorityModel,
				},
			),
	);
