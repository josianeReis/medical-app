import { t } from 'elysia';
import {
	validateDocument,
	type DocumentType,
	type CountryCode,
} from '@packages/utils';
import { ValidationError } from '@/domain/errors/validation-error';

// Map document types to their default countries
const getDefaultCountryForDocumentType = (type: string): CountryCode => {
	const upperType = type.toUpperCase();
	switch (upperType) {
		case 'CPF':
		case 'CNPJ':
		case 'RG':
		case 'CNH':
			return 'BR';
		case 'SSN':
		case 'DRIVER_LICENSE':
			return 'US';
		case 'PASSPORT':
		case 'MRZ':
		case 'NATIONAL_ID':
		default:
			return 'US'; // Global documents default to US
	}
};

export const DocumentInputModel = t
	.Transform(
		t.Object({
			type: t.Union(
				[
					t.Literal('CPF'),
					t.Literal('CNPJ'),
					t.Literal('RG'),
					t.Literal('CNH'),
					t.Literal('SSN'),
					t.Literal('PASSPORT'),
					// Also accept lowercase for compatibility
					t.Literal('cpf'),
					t.Literal('cnpj'),
					t.Literal('rg'),
					t.Literal('cnh'),
					t.Literal('ssn'),
					t.Literal('passport'),
				],
				{
					error: 'errors.invalid_document_type',
				},
			),
			number: t.String({
				minLength: 1,
				error: 'errors.invalid_document_number',
			}),
			country: t.Optional(t.String()),
		}),
	)
	.Decode((value) => {
		// Normalize document type to uppercase
		const normalizedType = value.type.toUpperCase() as DocumentType;

		// Auto-detect country if not provided
		const country =
			value.country || getDefaultCountryForDocumentType(normalizedType);

		// Validate using the comprehensive validator
		const result = validateDocument({
			type: normalizedType,
			number: value.number,
			country: country as CountryCode,
		});

		if (!result.isValid) {
			const fieldErrors: Record<string, string[]> = {};

			// Map specific error messages to appropriate fields
			if (result.errors && result.errors.length > 0) {
				result.errors.forEach((error) => {
					if (error === 'errors.unsupported_document_country_combination') {
						// Specific error for country/document mismatch
						fieldErrors.type = [
							`Document type ${normalizedType} is not valid for country ${country}. ${normalizedType} requires country ${getDefaultCountryForDocumentType(normalizedType)}.`,
						];
					} else if (error.includes('cpf') || error.includes('CPF')) {
						fieldErrors.number = [error];
					} else if (error.includes('cnpj') || error.includes('CNPJ')) {
						fieldErrors.number = [error];
					} else if (error.includes('rg') || error.includes('RG')) {
						fieldErrors.number = [error];
					} else if (error.includes('cnh') || error.includes('CNH')) {
						fieldErrors.number = [error];
					} else if (error.includes('ssn') || error.includes('SSN')) {
						fieldErrors.number = [error];
					} else if (error.includes('passport') || error.includes('PASSPORT')) {
						fieldErrors.number = [error];
					} else if (error.includes('type')) {
						fieldErrors.type = [error];
					} else if (error.includes('country')) {
						fieldErrors.country = [error];
					} else {
						// Default to number field for other validation errors
						fieldErrors.number = [error];
					}
				});
			} else {
				fieldErrors.number = ['errors.invalid_document'];
			}

			throw new ValidationError(fieldErrors);
		}

		// Return the validated document with normalized values
		return {
			type: normalizedType.toLowerCase() as typeof value.type, // Convert back to lowercase for consistency
			number: result.document.number || value.number, // Use formatted number if available
			country: country,
		};
	})
	.Encode((value) => value);

export const DocumentOutputModel = DocumentInputModel;
