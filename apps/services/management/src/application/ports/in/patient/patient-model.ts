import { t } from 'elysia';
import { DocumentInputModel } from './document-model';
import { createAddressModel, updateAddressModel } from './address-model';
import { organizationIdModel } from '../params/organization-id';
import { paginationModel } from '../pagination-model';

// Phone validators relying on FormatRegistry 'phone'
const phoneNumberRequired = t.String({
	format: 'phone',
	error: 'errors.invalid_phone_number',
});
const phoneNumberOptional = t.Optional(
	t.String({
		format: 'phone-optional',
		error: 'errors.invalid_phone_number',
	}),
);

export const genderModel = t.Union(
	[t.Literal('M'), t.Literal('F'), t.Literal('O')],
	{
		error: 'errors.invalid_gender',
		description:
			'The gender should be one of: M for male, F for female, O for other',
	},
);

export const patientIdModel = t.Composite([
	t.Object({
		id: t.String(),
	}),
	organizationIdModel,
]);

const createPatientByEmail = t.Object({
	name: t.String(),
	birthdate: t.String(),
	phoneNumber: phoneNumberOptional,
	documents: t.Optional(t.Array(DocumentInputModel)),
	gender: t.Optional(genderModel),
	email: t.String({ format: 'email' }),
	secondPhoneNumber: phoneNumberOptional,
	address: t.Optional(t.Array(createAddressModel)),
});

const createPatientByDocument = t.Object({
	name: t.String(),
	birthdate: t.String(),
	phoneNumber: phoneNumberRequired,
	documents: t.Array(DocumentInputModel, { minLength: 1 }),
	gender: t.Optional(genderModel),
	email: t.Optional(t.String({ format: 'email' })),
	secondPhoneNumber: phoneNumberOptional,
	address: t.Optional(t.Array(createAddressModel)),
});

export const createPatientModel = t.Union([
	createPatientByEmail,
	createPatientByDocument,
]);

export const updatePatientModel = t.Object({
	name: t.Optional(t.String()),
	birthdate: t.Optional(t.String()),
	gender: t.Optional(genderModel),
	phoneNumber: phoneNumberOptional,
	secondPhoneNumber: phoneNumberOptional,
	address: t.Optional(t.Array(updateAddressModel)),
	documents: t.Optional(
		t.Array(DocumentInputModel, {
			minLength: 1,
			error: 'errors.documents_min_length',
		}),
	),
	email: t.Optional(
		t.String({ format: 'email', error: 'errors.invalid_email' }),
	),
});

export const listPatientsModel = t.Composite([
	paginationModel,
	t.Object({
		filters: t.Optional(t.String()),
		name: t.Optional(t.String()),
		birthdate: t.Optional(t.String()),
		phoneNumber: t.Optional(t.String()),
		secondPhoneNumber: t.Optional(t.String()),
		sort: t.Optional(t.String()),
		q: t.Optional(
			t.String({
				minLength: 2,
				description: 'Full-text search query',
			}),
		),
	}),
]);

export type CreatePatientBody = typeof createPatientModel.static;
export type UpdatePatientBody = typeof updatePatientModel.static;
export type DocumentBody = typeof DocumentInputModel.static;
export type ListPatientsInput = typeof listPatientsModel.static;

export const linkToUserModel = t.Object({
	document: t.String(),
	documentType: t.String(),
	birthdate: t.String(),
});
