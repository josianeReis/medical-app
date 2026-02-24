import * as cpf from '@fnando/cpf';
import * as cnpj from '@fnando/cnpj';
import { t } from 'elysia';
import { z } from 'zod';
import type { 
  DocumentValidationResult, 
  DocumentValidationOptions, 
  BrazilianDocumentType 
} from './types';

/**
 * Brazilian Document Validators
 */

// CPF Validation
export const validateCPF = (document: string, options: DocumentValidationOptions = {}): DocumentValidationResult => {
  const isValid = cpf.isValid(document, options.strict);
  
  return {
    isValid,
    document: {
      type: 'CPF',
      number: cpf.strip(document),
      country: 'BR',
      formatted: isValid ? cpf.format(document) : undefined,
    },
    errors: isValid ? [] : ['errors.invalid_cpf'],
    metadata: {
      stripped: cpf.strip(document),
    },
  };
};

// CNPJ Validation
export const validateCNPJ = (document: string, options: DocumentValidationOptions = {}): DocumentValidationResult => {
  const isValid = cnpj.isValid(document, options.strict);
  
  return {
    isValid,
    document: {
      type: 'CNPJ', 
      number: cnpj.strip(document),
      country: 'BR',
      formatted: isValid ? cnpj.format(document) : undefined,
    },
    errors: isValid ? [] : ['errors.invalid_cnpj'],
    metadata: {
      stripped: cnpj.strip(document),
    },
  };
};

// RG Validation (Brazilian Identity Card - basic format validation)
export const validateRG = (document: string, options: DocumentValidationOptions = {}): DocumentValidationResult => {
  const cleaned = document.replace(/[^\dXx]/g, '').toUpperCase();
  const rgPattern = /^\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]$/;
  const isValid = rgPattern.test(document) && cleaned.length >= 8 && cleaned.length <= 9;
  
  return {
    isValid,
    document: {
      type: 'RG',
      number: cleaned,
      country: 'BR',
      formatted: isValid ? formatRG(cleaned) : undefined,
    },
    errors: isValid ? [] : ['errors.invalid_rg'],
    metadata: {
      cleaned,
      pattern: 'XX.XXX.XXX-X',
    },
  };
};

// CNH Validation (Brazilian Driver's License - basic format validation)
export const validateCNH = (document: string, options: DocumentValidationOptions = {}): DocumentValidationResult => {
  const cleaned = document.replace(/\D/g, '');
  const isValid = cleaned.length === 11 && /^\d{11}$/.test(cleaned);
  
  return {
    isValid,
    document: {
      type: 'CNH',
      number: cleaned,
      country: 'BR',
      formatted: isValid ? formatCNH(cleaned) : undefined,
    },
    errors: isValid ? [] : ['errors.invalid_cnh'],
    metadata: {
      cleaned,
      pattern: 'XXXXXXXXXXX (11 digits)',
    },
  };
};

// Helper functions
const formatRG = (rg: string): string => {
  if (rg.length === 8) {
    return `${rg.slice(0, 1)}.${rg.slice(1, 4)}.${rg.slice(4, 7)}-${rg.slice(7)}`;
  } else if (rg.length === 9) {
    return `${rg.slice(0, 2)}.${rg.slice(2, 5)}.${rg.slice(5, 8)}-${rg.slice(8)}`;
  }
  return rg;
};

const formatCNH = (cnh: string): string => {
  return cnh; // CNH is typically stored without formatting
};

// Main Brazilian document validator
export const validateBrazilianDocument = (
  type: BrazilianDocumentType,
  document: string,
  options: DocumentValidationOptions = {}
): DocumentValidationResult => {
  switch (type) {
    case 'CPF':
      return validateCPF(document, options);
    case 'CNPJ':
      return validateCNPJ(document, options);
    case 'RG':
      return validateRG(document, options);
    case 'CNH':
      return validateCNH(document, options);
    default:
      return {
        isValid: false,
        document: { type, number: document, country: 'BR' },
        errors: ['errors.unsupported_document_type'],
      };
  }
};

/**
 * TypeBox Validators for Elysia
 */
export const CPFValidator = t.String({
  pattern: '^\\d{3}\\.?\\d{3}\\.?\\d{3}-?\\d{2}$',
  error: 'errors.invalid_cpf_format',
  description: 'Brazilian CPF number. Format: XXX.XXX.XXX-XX or XXXXXXXXXXX',
});

export const CNPJValidator = t.String({
  pattern: '^\\d{2}\\.?\\d{3}\\.?\\d{3}\\/?\\d{4}-?\\d{2}$',
  error: 'errors.invalid_cnpj_format', 
  description: 'Brazilian CNPJ number. Format: XX.XXX.XXX/XXXX-XX or XXXXXXXXXXXXXX',
});

export const RGValidator = t.String({
  pattern: '^\\d{1,2}\\.?\\d{3}\\.?\\d{3}-?[\\dXx]$',
  error: 'errors.invalid_rg_format',
  description: 'Brazilian RG number. Format: XX.XXX.XXX-X',
});

export const CNHValidator = t.String({
  pattern: '^\\d{11}$',
  error: 'errors.invalid_cnh_format',
  description: 'Brazilian CNH number. Format: 11 digits',
});

export const BrazilianDocumentValidator = t.Union([
  CPFValidator,
  CNPJValidator,
  RGValidator,
  CNHValidator,
], {
  error: 'errors.invalid_brazilian_document',
  description: 'Valid Brazilian document number (CPF, CNPJ, RG, or CNH)',
});

/**
 * Zod Validators
 */
export const CPFZodValidator = z.string()
  .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'errors.invalid_cpf_format')
  .refine((value) => validateCPF(value).isValid, 'errors.invalid_cpf');

export const CNPJZodValidator = z.string()
  .regex(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/, 'errors.invalid_cnpj_format')
  .refine((value) => validateCNPJ(value).isValid, 'errors.invalid_cnpj');

export const RGZodValidator = z.string()
  .regex(/^\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx]$/, 'errors.invalid_rg_format')
  .refine((value) => validateRG(value).isValid, 'errors.invalid_rg');

export const CNHZodValidator = z.string()
  .regex(/^\d{11}$/, 'errors.invalid_cnh_format')
  .refine((value) => validateCNH(value).isValid, 'errors.invalid_cnh');

export const BrazilianDocumentZodValidator = z.union([
  CPFZodValidator,
  CNPJZodValidator,
  RGZodValidator,
  CNHZodValidator,
]);

/**
 * Utility functions
 */
export const isBrazilianDocumentType = (type: string): type is BrazilianDocumentType => {
  return ['CPF', 'CNPJ', 'RG', 'CNH'].includes(type);
};

export const getBrazilianDocumentPattern = (type: BrazilianDocumentType): string => {
  switch (type) {
    case 'CPF': return 'XXX.XXX.XXX-XX';
    case 'CNPJ': return 'XX.XXX.XXX/XXXX-XX';
    case 'RG': return 'XX.XXX.XXX-X';
    case 'CNH': return 'XXXXXXXXXXX';
  }
}; 