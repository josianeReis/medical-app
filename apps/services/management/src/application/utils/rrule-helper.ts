import { Appointment } from '@/domain/entities/appointment';
import { rrulestr } from 'rrule';

export function expandRecurrence(
	appointment: Appointment,
	from: Date,
	to: Date,
): Appointment[] {
	if (!appointment.recurrenceRule) return [];

	const rule = rrulestr(appointment.recurrenceRule, {
		dtstart: appointment.start,
	});
	const dates = rule.between(from, to, true);

	return dates.map((dt) => ({
		...appointment,
		id: `${appointment.id}::${dt.toISOString()}`,
		start: dt,
		end: new Date(
			dt.getTime() + (appointment.end.getTime() - appointment.start.getTime()),
		),
		seriesId: appointment.id,
	}));
}
