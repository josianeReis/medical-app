import { validateDocument, smartValidateDocument } from './document-validator';
import type { DocumentInput, DocumentType } from './types';
import type { CountryCode } from '../country-codes';

/**
 * Document validation helpers that throw errors with i18n codes
 * These integrate with your existing HttpError system
 */

/**
 * Validate document and throw error with i18n code if invalid
 */
export const validateDocumentOrThrow = (input: DocumentInput): void => {
  const result = validateDocument(input);
  
  if (!result.isValid) {
    const errorMessage = result.errors?.[0] || 'errors.invalid_document';
    throw new Error(errorMessage);
  }
};

/**
 * Validate document number for specific type and country
 */
export const validateDocumentNumberOrThrow = (
  type: DocumentType,
  number: string,
  country: CountryCode
): void => {
  validateDocumentOrThrow({ type, number, country });
};

/**
 * Smart validate document with auto-detection
 */
export const smartValidateDocumentOrThrow = (
  number: string,
  hint?: { type?: DocumentType; country?: CountryCode }
): void => {
  const result = smartValidateDocument(number, hint);
  
  if (!result.isValid) {
    const errorMessage = result.errors?.[0] || 'errors.could_not_validate_document';
    throw new Error(errorMessage);
  }
};

/**
 * Validate Brazilian CPF
 */
export const validateCPFOrThrow = (cpf: string): void => {
  validateDocumentOrThrow({ type: 'CPF', number: cpf, country: 'BR' });
};

/**
 * Validate Brazilian CNPJ
 */
export const validateCNPJOrThrow = (cnpj: string): void => {
  validateDocumentOrThrow({ type: 'CNPJ', number: cnpj, country: 'BR' });
};

/**
 * Validate Brazilian RG
 */
export const validateRGOrThrow = (rg: string): void => {
  validateDocumentOrThrow({ type: 'RG', number: rg, country: 'BR' });
};

/**
 * Validate Brazilian CNH
 */
export const validateCNHOrThrow = (cnh: string): void => {
  validateDocumentOrThrow({ type: 'CNH', number: cnh, country: 'BR' });
};

/**
 * Validate US SSN
 */
export const validateSSNOrThrow = (ssn: string): void => {
  validateDocumentOrThrow({ type: 'SSN', number: ssn, country: 'US' });
};

/**
 * Validate passport for any country
 */
export const validatePassportOrThrow = (passport: string, country: CountryCode): void => {
  validateDocumentOrThrow({ type: 'PASSPORT', number: passport, country });
};

/**
 * Validate MRZ for any country
 */
export const validateMRZOrThrow = (mrz: string | string[], country: CountryCode): void => {
  validateDocumentOrThrow({ type: 'MRZ', number: mrz as any, country });
};

/**
 * Create a validation function for specific document type and country
 */
export const createDocumentValidator = (type: DocumentType, country: CountryCode) => {
  return (number: string | string[]) => {
    validateDocumentOrThrow({ type, number: number as any, country });
  };
};

/**
 * Get validation error message with fallback
 */
export const getValidationErrorMessage = (error: unknown, fallback: string = 'errors.invalid_document'): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

/**
 * Check if a document is valid without throwing
 */
export const isDocumentValid = (input: DocumentInput): boolean => {
  try {
    validateDocumentOrThrow(input);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get document validation result with error details
 */
export const getDocumentValidationResult = (input: DocumentInput) => {
  const result = validateDocument(input);
  return {
    isValid: result.isValid,
    errors: result.errors || [],
    document: result.document,
    metadata: result.metadata,
  };
}; 