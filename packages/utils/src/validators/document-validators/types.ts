import type { CountryCode } from '../country-codes';

// Base document types
export type DocumentType = 
  | 'CPF'
  | 'CNPJ' 
  | 'RG'
  | 'CNH'
  | 'PASSPORT'
  | 'SSN'
  | 'DRIVER_LICENSE'
  | 'NATIONAL_ID'
  | 'MRZ';

// Document validation result
export interface DocumentValidationResult {
  isValid: boolean;
  document: {
    type: DocumentType;
    number: string;
    country: CountryCode;
    formatted?: string;
  };
  errors?: string[];
  metadata?: Record<string, any>;
}

// Document validation options
export interface DocumentValidationOptions {
  strict?: boolean;
  allowMasked?: boolean;
  country?: CountryCode;
  type?: DocumentType;
}

// Brazilian document types
export type BrazilianDocumentType = 'CPF' | 'CNPJ' | 'RG' | 'CNH';

// US document types  
export type USDocumentType = 'SSN' | 'DRIVER_LICENSE' | 'PASSPORT';

// Global document types (available worldwide)
export type GlobalDocumentType = 'PASSPORT' | 'MRZ';

// Document number input
export interface DocumentInput {
  type: DocumentType;
  number: string;
  country: CountryCode;
} 