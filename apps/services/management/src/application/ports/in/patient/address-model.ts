import { address } from '@packages/data-access';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';
import { t } from 'elysia';

export const createAddressModel = createInsertSchema(address, {
	street: t.String(),
	number: t.String(),
	complement: t.Optional(t.String()),
	neighborhood: t.String(),
	city: t.String(),
	state: t.String(),
	zipCode: t.String(),
	country: t.String(),
});

export const selectAddressModel = createSelectSchema(address);
export const updateAddressModel = t.Partial(createAddressModel);
