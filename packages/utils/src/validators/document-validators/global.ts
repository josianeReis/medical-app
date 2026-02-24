import { parse as parseMRZ } from 'mrz';
import { t } from 'elysia';
import { z } from 'zod';
import type { CountryCode } from '../country-codes';
import type { 
  DocumentValidationResult, 
  DocumentValidationOptions, 
  GlobalDocumentType 
} from './types';

/**
 * Global Document Validators (Available worldwide)
 */

// MRZ Validation (Machine Readable Zone)
export const validateMRZ = (document: string | string[], options: DocumentValidationOptions = {}): DocumentValidationResult => {
  try {
    const result = parseMRZ(document, { autocorrect: !options.strict });
    
    return {
      isValid: result.valid,
      document: {
        type: 'MRZ',
        number: result.fields.documentNumber || '',
        country: (result.fields.issuingState as any) || 'XX',
        formatted: Array.isArray(document) ? document.join('\n') : document,
      },
      errors: result.valid ? [] : ['errors.invalid_mrz'],
      metadata: {
        format: result.format,
        fields: result.fields,
        details: result.details,
        documentNumber: result.documentNumber,
      },
    };
  } catch (error) {
    return {
      isValid: false,
             document: {
         type: 'MRZ',
         number: '',
         country: 'US' as CountryCode, // Fallback country code
         formatted: Array.isArray(document) ? document.join('\n') : document,
       },
      errors: ['errors.invalid_mrz_format'],
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
};

// International Passport Validation (using MRZ when available)
export const validateInternationalPassport = (document: string, country?: string, options: DocumentValidationOptions = {}): DocumentValidationResult => {
  const cleaned = document.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Basic passport number validation (varies by country)
  // Most passports are 6-12 alphanumeric characters
  const isValid = cleaned.length >= 6 && cleaned.length <= 12 && /^[A-Z0-9]+$/.test(cleaned);
  
  return {
    isValid,
    document: {
      type: 'PASSPORT',
      number: cleaned,
      country: (country as CountryCode) || 'US',
      formatted: cleaned,
    },
    errors: isValid ? [] : ['errors.invalid_passport'],
    metadata: {
      cleaned,
      pattern: '6-12 alphanumeric characters',
      note: 'Passport formats vary by country. Use MRZ validation for more accurate results.',
    },
  };
};

// Main global document validator
export const validateGlobalDocument = (
  type: GlobalDocumentType,
  document: string | string[],
  options: DocumentValidationOptions = {}
): DocumentValidationResult => {
  switch (type) {
    case 'MRZ':
      return validateMRZ(document, options);
    case 'PASSPORT':
      return validateInternationalPassport(
        Array.isArray(document) ? document.join('') : document, 
        options.country, 
        options
      );
    default:
      return {
        isValid: false,
                 document: { 
           type, 
           number: Array.isArray(document) ? document.join('') : document, 
           country: 'US' as CountryCode 
         },
        errors: ['errors.unsupported_document_type'],
      };
  }
};

/**
 * TypeBox Validators for Elysia
 */
export const MRZValidator = t.Union([
  t.String({
    minLength: 60,
    maxLength: 200,
    error: 'errors.invalid_mrz_format',
    description: 'Machine Readable Zone string with line breaks',
  }),
  t.Array(t.String({
    minLength: 30,
    maxLength: 44,
    error: 'errors.invalid_mrz_line_format',
  }), {
    minItems: 2,
    maxItems: 3,
    error: 'errors.invalid_mrz_lines_count',
    description: 'Array of MRZ lines (2-3 lines)',
  }),
], {
  error: 'errors.invalid_mrz',
  description: 'Machine Readable Zone (MRZ) data as string or array of lines',
});

export const InternationalPassportValidator = t.String({
  pattern: '^[A-Za-z0-9]{6,12}$',
  error: 'errors.invalid_passport_format',
  description: 'International passport number. Format: 6-12 alphanumeric characters',
});

export const GlobalDocumentValidator = t.Union([
  MRZValidator,
  InternationalPassportValidator,
], {
  error: 'errors.invalid_global_document',
  description: 'Valid global document (MRZ or International Passport)',
});

/**
 * Zod Validators
 */
export const MRZZodValidator = z.union([
  z.string()
    .min(60, 'errors.mrz_too_short')
    .max(200, 'errors.mrz_too_long'),
  z.array(z.string().min(30).max(44))
    .min(2, 'errors.mrz_lines_too_few')
    .max(3, 'errors.mrz_lines_too_many'),
]).refine((value) => validateMRZ(value).isValid, 'errors.invalid_mrz');

export const InternationalPassportZodValidator = z.string()
  .regex(/^[A-Za-z0-9]{6,12}$/, 'errors.invalid_passport_format')
  .refine((value) => validateInternationalPassport(value).isValid, 'errors.invalid_passport');

export const GlobalDocumentZodValidator = z.union([
  MRZZodValidator,
  InternationalPassportZodValidator,
]);

/**
 * Utility functions
 */
export const isGlobalDocumentType = (type: string): type is GlobalDocumentType => {
  return ['MRZ', 'PASSPORT'].includes(type);
};

export const getGlobalDocumentPattern = (type: GlobalDocumentType): string => {
  switch (type) {
    case 'MRZ': return 'Machine Readable Zone (2-3 lines)';
    case 'PASSPORT': return '6-12 alphanumeric characters';
  }
};

export const parseMRZData = (mrz: string | string[]) => {
  try {
    return parseMRZ(mrz, { autocorrect: true });
  } catch (error) {
    return null;
  }
};

/**
 * MRZ Utility Functions
 */
export const extractDataFromMRZ = (mrz: string | string[]) => {
  const result = parseMRZData(mrz);
  if (!result || !result.valid) return null;

  return {
    documentType: result.fields.documentCode,
    documentNumber: result.fields.documentNumber,
    issuingCountry: result.fields.issuingState,
    nationality: result.fields.nationality,
    lastName: result.fields.lastName,
    firstName: result.fields.firstName,
    sex: result.fields.sex,
    dateOfBirth: result.fields.birthDate,
    expirationDate: result.fields.expirationDate,
    personalNumber: result.fields.personalNumber,
    valid: result.valid,
    format: result.format,
  };
};

export const validateMRZChecksum = (mrz: string | string[]) => {
  const result = parseMRZData(mrz);
  return result ? result.valid : false;
}; 