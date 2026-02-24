import { isValid as isValidSSN, mask as maskSSN } from 'ssn-validator';
import { t } from 'elysia';
import { z } from 'zod';
import type {
	DocumentValidationResult,
	DocumentValidationOptions,
	USDocumentType,
} from './types';

/**
 * US Document Validators
 */

// SSN Validation (Social Security Number)
export const validateSSN = (
	document: string,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	const cleaned = document.replace(/\D/g, '');
	const isValid = isValidSSN(document);

	return {
		isValid,
		document: {
			type: 'SSN',
			number: cleaned,
			country: 'US',
			formatted: isValid ? formatSSN(cleaned) : undefined,
		},
		errors: isValid ? [] : ['errors.invalid_ssn'],
		metadata: {
			cleaned,
			masked: isValid ? maskSSN(document) : undefined,
			pattern: 'XXX-XX-XXXX',
		},
	};
};

// Driver's License Validation (basic format validation - varies by state)
export const validateDriverLicense = (
	document: string,
	state?: string,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	const cleaned = document.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

	// Basic validation - driver's license formats vary significantly by state
	const isValid =
		cleaned.length >= 8 && cleaned.length <= 15 && /^[A-Z0-9]+$/.test(cleaned);

	return {
		isValid,
		document: {
			type: 'DRIVER_LICENSE',
			number: cleaned,
			country: 'US',
			formatted: cleaned,
		},
		errors: isValid ? [] : ['errors.invalid_driver_license'],
		metadata: {
			cleaned,
			state,
			note: 'Driver license formats vary by state',
		},
	};
};

// US Passport Validation (basic format validation)
export const validateUSPassport = (
	document: string,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	const cleaned = document.replace(/[^A-Za-z0-9]/g, '').toUpperCase();

	// US passport numbers are typically 9 characters (letters and numbers)
	const isValid = cleaned.length === 9 && /^[A-Z0-9]{9}$/.test(cleaned);

	return {
		isValid,
		document: {
			type: 'PASSPORT',
			number: cleaned,
			country: 'US',
			formatted: cleaned,
		},
		errors: isValid ? [] : ['errors.invalid_us_passport'],
		metadata: {
			cleaned,
			pattern: '9 alphanumeric characters',
		},
	};
};

// Helper functions
const formatSSN = (ssn: string): string => {
	if (ssn.length === 9) {
		return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5)}`;
	}
	return ssn;
};

// Main US document validator
export const validateUSDocument = (
	type: USDocumentType,
	document: string,
	options: DocumentValidationOptions = {},
): DocumentValidationResult => {
	switch (type) {
		case 'SSN':
			return validateSSN(document, options);
		case 'DRIVER_LICENSE':
			return validateDriverLicense(document, undefined, options);
		case 'PASSPORT':
			return validateUSPassport(document, options);
		default:
			return {
				isValid: false,
				document: { type, number: document, country: 'US' },
				errors: ['errors.unsupported_document_type'],
			};
	}
};

/**
 * TypeBox Validators for Elysia
 */
export const SSNValidator = t.String({
	pattern: '^\\d{3}-?\\d{2}-?\\d{4}$',
	error: 'errors.invalid_ssn_format',
	description: 'US Social Security Number. Format: XXX-XX-XXXX or XXXXXXXXX',
});

export const DriverLicenseValidator = t.String({
	minLength: 8,
	maxLength: 15,
	pattern: '^[A-Za-z0-9]+$',
	error: 'errors.invalid_driver_license_format',
	description:
		'US Driver License number. Format varies by state, 8-15 alphanumeric characters',
});

export const USPassportValidator = t.String({
	pattern: '^[A-Za-z0-9]{9}$',
	error: 'errors.invalid_us_passport_format',
	description: 'US Passport number. Format: 9 alphanumeric characters',
});

export const USDocumentValidator = t.Union(
	[SSNValidator, DriverLicenseValidator, USPassportValidator],
	{
		error: 'errors.invalid_us_document',
		description: 'Valid US document number (SSN, Driver License, or Passport)',
	},
);

/**
 * Zod Validators
 */
export const SSNZodValidator = z
	.string()
	.regex(/^\d{3}-?\d{2}-?\d{4}$/, 'errors.invalid_ssn_format')
	.refine((value) => validateSSN(value).isValid, 'errors.invalid_ssn');

export const DriverLicenseZodValidator = z
	.string()
	.min(8, 'errors.driver_license_too_short')
	.max(15, 'errors.driver_license_too_long')
	.regex(/^[A-Za-z0-9]+$/, 'errors.invalid_driver_license_format')
	.refine(
		(value) => validateDriverLicense(value).isValid,
		'errors.invalid_driver_license',
	);

export const USPassportZodValidator = z
	.string()
	.regex(/^[A-Za-z0-9]{9}$/, 'errors.invalid_us_passport_format')
	.refine(
		(value) => validateUSPassport(value).isValid,
		'errors.invalid_us_passport',
	);

export const USDocumentZodValidator = z.union([
	SSNZodValidator,
	DriverLicenseZodValidator,
	USPassportZodValidator,
]);

/**
 * Utility functions
 */
export const isUSDocumentType = (type: string): type is USDocumentType => {
	return ['SSN', 'DRIVER_LICENSE', 'PASSPORT'].includes(type);
};

export const getUSDocumentPattern = (type: USDocumentType): string => {
	switch (type) {
		case 'SSN':
			return 'XXX-XX-XXXX';
		case 'DRIVER_LICENSE':
			return '8-15 alphanumeric characters (varies by state)';
		case 'PASSPORT':
			return '9 alphanumeric characters';
	}
};

export const maskUSDocument = (
	type: USDocumentType,
	document: string,
): string => {
	switch (type) {
		case 'SSN':
			return validateSSN(document).metadata?.masked || document;
		case 'DRIVER_LICENSE':
			const cleaned = document.replace(/[^A-Za-z0-9]/g, '');
			return cleaned.length > 4
				? `${cleaned.slice(0, 2)}${'X'.repeat(cleaned.length - 4)}${cleaned.slice(-2)}`
				: document;
		case 'PASSPORT':
			return document.length > 4
				? `${document.slice(0, 2)}${'X'.repeat(document.length - 4)}${document.slice(-2)}`
				: document;
		default:
			return document;
	}
};
