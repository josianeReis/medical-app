import { t } from 'elysia';

export const paginationModel = t.Object({
	page: t.Optional(t.Numeric({ default: 1 })),
	limit: t.Optional(t.Numeric({ default: 10 })),
});
