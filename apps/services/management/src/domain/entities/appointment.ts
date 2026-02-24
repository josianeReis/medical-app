import { appointment } from '@packages/data-access';
import { InferSelectModel } from 'drizzle-orm';

export type AppointmentStatus =
	| 'SCHEDULED'
	| 'RESCHEDULED'
	| 'CANCELLED'
	| 'COMPLETED';

/**
 * Domain entity representing a patient appointment.
 * NOTE: The actual table definition will live in the data-access package (Drizzle schema).
 */
export type Appointment = InferSelectModel<typeof appointment>;
