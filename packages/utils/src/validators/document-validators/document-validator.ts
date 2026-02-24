import { t } from 'elysia';
import { z } from 'zod';
import type { CountryCode } from '../country-codes';
import {
	COUNTRY_CODES,
	OptionalCountryCodeValidator,
	CountryCodeZodValidator,
} from '../country-codes';
import type {
	DocumentType,
	DocumentInput,
	DocumentValidationResult,
	DocumentValidationOptions,
} from './types';
import { validateBrazilianDocument, isBrazilianDocumentType } from './brazil';
import { validateUSDocument, isUSDocumentType } from './usa';
import { validateGlobalDocument, isGlobalDocumentType } from './global';

/**
 * Universal Document Validator
 * Routes document validation to the appropriate country-specific validator
 */
export const validateDocument = (
	input: DocumentInput,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	const { type, number, country } = input;

	// Route to country-specific validators
	switch (country) {
		case 'BR':
			if (isBrazilianDocumentType(type)) {
				return validateBrazilianDocument(type, number, options);
			}
			break;
		case 'US':
			if (isUSDocumentType(type)) {
				return validateUSDocument(type, number, options);
			}
			break;
		default:
			// Check if it's a global document type
			if (isGlobalDocumentType(type)) {
				return validateGlobalDocument(type, number, { ...options, country });
			}
	}

	// Fallback for unsupported combinations
	return {
		isValid: false,
		document: { type, number, country },
		errors: ['errors.unsupported_document_country_combination'],
		metadata: {
			supportedCombinations: getSupportedDocumentTypes(),
		},
	};
};

/**
 * Validation by document type only (auto-detect country when possible)
 */
export const validateDocumentByType = (
	type: DocumentType,
	number: string,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	// Try to determine country from document type
	const possibleCountries = getPossibleCountriesForDocumentType(type);

	if (possibleCountries.length === 1) {
		return validateDocument(
			{ type, number, country: possibleCountries[0] },
			options,
		);
	}

	// If multiple possibilities, try each one and return the first valid result
	for (const country of possibleCountries) {
		const result = validateDocument({ type, number, country }, options);
		if (result.isValid) {
			return result;
		}
	}

	// No valid result found
	return {
		isValid: false,
		document: { type, number, country: 'XX' as CountryCode },
		errors: ['errors.could_not_determine_document_country'],
		metadata: {
			possibleCountries,
			suggestion: 'Please specify the country explicitly',
		},
	};
};

/**
 * Smart document validator - attempts to detect document type and country
 */
export const smartValidateDocument = (
	number: string,
	hint?: { type?: DocumentType; country?: CountryCode },
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	const cleaned = number.replace(/[^A-Za-z0-9]/g, '');

	// Use hints if provided
	if (hint?.type && hint?.country) {
		return validateDocument(
			{ type: hint.type, number, country: hint.country },
			options,
		);
	}

	// Try to detect document type by format
	const detectedTypes = detectDocumentType(number);

	for (const type of detectedTypes) {
		const countries = hint?.country
			? [hint.country]
			: getPossibleCountriesForDocumentType(type);

		for (const country of countries) {
			const result = validateDocument({ type, number, country }, options);
			if (result.isValid) {
				return {
					...result,
					metadata: {
						...result.metadata,
						autoDetected: { type, country },
					},
				};
			}
		}
	}

	return {
		isValid: false,
		document: { type: 'NATIONAL_ID', number, country: 'XX' as CountryCode },
		errors: ['errors.could_not_detect_document_type'],
		metadata: {
			detectedTypes,
			suggestion: 'Please specify the document type and country explicitly',
		},
	};
};

/**
 * Utility Functions
 */
export const getSupportedDocumentTypes = (): Record<string, DocumentType[]> => {
	// Country-specific document types
	const countrySpecific: Record<string, DocumentType[]> = {
		BR: ['CPF', 'CNPJ', 'RG', 'CNH'],
		US: ['SSN', 'DRIVER_LICENSE'],
	};

	// Global document types supported by ALL countries
	const globalTypes: DocumentType[] = ['PASSPORT', 'MRZ', 'NATIONAL_ID'];

	const result: Record<string, DocumentType[]> = {};

	for (const country of COUNTRY_CODES) {
		result[country] = [
			...(countrySpecific[country as keyof typeof countrySpecific] || []),
			...globalTypes,
		];
	}

	return result;
};

export const getPossibleCountriesForDocumentType = (
	type: DocumentType,
): CountryCode[] => {
	switch (type) {
		case 'CPF':
		case 'CNPJ':
		case 'RG':
		case 'CNH':
			return ['BR'];
		case 'SSN':
		case 'DRIVER_LICENSE':
			return ['US'];
		case 'PASSPORT':
		case 'MRZ':
		case 'NATIONAL_ID':
			return [...COUNTRY_CODES];
		default:
			return [];
	}
};

export const detectDocumentType = (number: string): DocumentType[] => {
	const cleaned = number.replace(/[^A-Za-z0-9]/g, '');
	const original = number.trim();
	const types: DocumentType[] = [];

	// CPF pattern (11 digits)
	if (/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/.test(original)) {
		types.push('CPF');
	}

	// CNPJ pattern (14 digits)
	if (/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/.test(original)) {
		types.push('CNPJ');
	}

	// SSN pattern (9 digits)
	if (/^\d{3}-?\d{2}-?\d{4}$/.test(original)) {
		types.push('SSN');
	}

	// CNH pattern (11 digits)
	if (/^\d{11}$/.test(cleaned)) {
		types.push('CNH');
	}

	// RG pattern
	if (/^\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]$/.test(original)) {
		types.push('RG');
	}

	// Passport patterns
	if (/^[A-Z0-9]{6,12}$/.test(cleaned)) {
		types.push('PASSPORT');
	}

	// MRZ patterns (multi-line)
	if (original.includes('\n') || original.length > 30) {
		types.push('MRZ');
	}

	// Fallback
	if (types.length === 0) {
		types.push('NATIONAL_ID');
	}

	return types;
};

/**
 * TypeBox validator for document input with validation
 */
export const DocumentInputValidator = t
	.Transform(
		t.Object({
			type: t.Union([
				t.Literal('CPF'),
				t.Literal('CNPJ'),
				t.Literal('RG'),
				t.Literal('CNH'),
				t.Literal('SSN'),
				t.Literal('DRIVER_LICENSE'),
				t.Literal('PASSPORT'),
				t.Literal('MRZ'),
				t.Literal('NATIONAL_ID'),
			]),
			number: t.Union([
				t.String({ minLength: 1 }),
				t.Array(t.String(), { minItems: 2, maxItems: 3 }),
			]),
			country: OptionalCountryCodeValidator,
		}),
	)
	.Decode((value) => {
		const result = validateDocument({
			type: value.type as DocumentType,
			number: value.number as any,
			country: value.country || 'US',
		});

		if (!result.isValid) {
			const errorCode = result.errors?.[0] || 'errors.invalid_document';
			throw new Error(errorCode);
		}

		return value;
	})
	.Encode((value) => value);

/**
 * Zod validator for document input with validation
 */
export const DocumentInputZodValidator = z
	.object({
		type: z.enum([
			'CPF',
			'CNPJ',
			'RG',
			'CNH',
			'SSN',
			'DRIVER_LICENSE',
			'PASSPORT',
			'MRZ',
			'NATIONAL_ID',
		]),
		number: z.union([z.string().min(1), z.array(z.string()).min(2).max(3)]),
		country: CountryCodeZodValidator,
	})
	.refine(
		(data) => {
			const result = validateDocument({
				type: data.type as DocumentType,
				number: data.number as any,
				country: data.country,
			});

			return result.isValid;
		},
		{
			message: 'errors.invalid_document',
			path: ['number'],
		},
	);
