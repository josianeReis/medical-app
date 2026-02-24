import { t } from 'elysia';

export const roomIdModel = t.Object({
	roomId: t.String(),
});

export const queueEntryIdModel = t.Object({
	entryId: t.String(),
});

export const checkInModel = t.Object({
	patientId: t.String(),
	appointmentId: t.Optional(t.String()),
	priority: t.Optional(t.Numeric()),
});

export const callNextModel = t.Object({}); // no body needed

export const updatePriorityModel = t.Object({
	priority: t.Numeric(),
});

export const transferModel = t.Object({
	targetRoomId: t.String(),
});

export type RoomIdParams = typeof roomIdModel.static;
export type QueueEntryIdParams = typeof queueEntryIdModel.static;
export type CheckInBody = typeof checkInModel.static;
export type UpdatePriorityBody = typeof updatePriorityModel.static;
export type TransferBody = typeof transferModel.static;
