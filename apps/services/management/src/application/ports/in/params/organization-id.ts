import { t } from 'elysia';

export const organizationIdModel = t.Object({
	organizationId: t.String({
		minLength: 1,
		error: 'errors.organization_id_required',
	}),
});

export type OrganizationId = typeof organizationIdModel.static;
