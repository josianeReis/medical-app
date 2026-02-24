declare module 'ssn-validator' {
  export function isValid(ssn: string): boolean;
  export function mask(ssn: string): string;
} 