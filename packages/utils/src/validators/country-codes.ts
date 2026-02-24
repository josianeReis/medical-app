/**
 * ISO 3166-1 alpha-2 country codes
 * Complete list of officially assigned country codes
 */
export const COUNTRY_CODES = [
	'AD',
	'AE',
	'AF',
	'AG',
	'AI',
	'AL',
	'AM',
	'AO',
	'AQ',
	'AR',
	'AS',
	'AT',
	'AU',
	'AW',
	'AX',
	'AZ',
	'BA',
	'BB',
	'BD',
	'BE',
	'BF',
	'BG',
	'BH',
	'BI',
	'BJ',
	'BL',
	'BM',
	'BN',
	'BO',
	'BQ',
	'BR',
	'BS',
	'BT',
	'BV',
	'BW',
	'BY',
	'BZ',
	'CA',
	'CC',
	'CD',
	'CF',
	'CG',
	'CH',
	'CI',
	'CK',
	'CL',
	'CM',
	'CN',
	'CO',
	'CR',
	'CU',
	'CV',
	'CW',
	'CX',
	'CY',
	'CZ',
	'DE',
	'DJ',
	'DK',
	'DM',
	'DO',
	'DZ',
	'EC',
	'EE',
	'EG',
	'EH',
	'ER',
	'ES',
	'ET',
	'FI',
	'FJ',
	'FK',
	'FM',
	'FO',
	'FR',
	'GA',
	'GB',
	'GD',
	'GE',
	'GF',
	'GG',
	'GH',
	'GI',
	'GL',
	'GM',
	'GN',
	'GP',
	'GQ',
	'GR',
	'GS',
	'GT',
	'GU',
	'GW',
	'GY',
	'HK',
	'HM',
	'HN',
	'HR',
	'HT',
	'HU',
	'ID',
	'IE',
	'IL',
	'IM',
	'IN',
	'IO',
	'IQ',
	'IR',
	'IS',
	'IT',
	'JE',
	'JM',
	'JO',
	'JP',
	'KE',
	'KG',
	'KH',
	'KI',
	'KM',
	'KN',
	'KP',
	'KR',
	'KW',
	'KY',
	'KZ',
	'LA',
	'LB',
	'LC',
	'LI',
	'LK',
	'LR',
	'LS',
	'LT',
	'LU',
	'LV',
	'LY',
	'MA',
	'MC',
	'MD',
	'ME',
	'MF',
	'MG',
	'MH',
	'MK',
	'ML',
	'MM',
	'MN',
	'MO',
	'MP',
	'MQ',
	'MR',
	'MS',
	'MT',
	'MU',
	'MV',
	'MW',
	'MX',
	'MY',
	'MZ',
	'NA',
	'NC',
	'NE',
	'NF',
	'NG',
	'NI',
	'NL',
	'NO',
	'NP',
	'NR',
	'NU',
	'NZ',
	'OM',
	'PA',
	'PE',
	'PF',
	'PG',
	'PH',
	'PK',
	'PL',
	'PM',
	'PN',
	'PR',
	'PS',
	'PT',
	'PW',
	'PY',
	'QA',
	'RE',
	'RO',
	'RS',
	'RU',
	'RW',
	'SA',
	'SB',
	'SC',
	'SD',
	'SE',
	'SG',
	'SH',
	'SI',
	'SJ',
	'SK',
	'SL',
	'SM',
	'SN',
	'SO',
	'SR',
	'SS',
	'ST',
	'SV',
	'SX',
	'SY',
	'SZ',
	'TC',
	'TD',
	'TF',
	'TG',
	'TH',
	'TJ',
	'TK',
	'TL',
	'TM',
	'TN',
	'TO',
	'TR',
	'TT',
	'TV',
	'TW',
	'TZ',
	'UA',
	'UG',
	'UM',
	'US',
	'UY',
	'UZ',
	'VA',
	'VC',
	'VE',
	'VG',
	'VI',
	'VN',
	'VU',
	'WF',
	'WS',
	'YE',
	'YT',
	'ZA',
	'ZM',
	'ZW',
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

import { t } from 'elysia';
import { z } from 'zod';

/**
 * TypeBox Validators
 */
export const CountryCodeValidator = t.Union(
	COUNTRY_CODES.map((code) => t.Literal(code)),
	{
		error: 'errors.invalid_country_code',
		description: 'ISO 3166-1 alpha-2 country code. Example: BR, US, etc.',
	},
);

/**
 * Optional country code validator (TypeBox)
 */
export const OptionalCountryCodeValidator = t.Optional(CountryCodeValidator);

/**
 * Array of country codes validator (TypeBox)
 */
export const CountryCodeArrayValidator = t.Array(CountryCodeValidator);

/**
 * Optional array of country codes validator (TypeBox)
 */
export const OptionalCountryCodeArrayValidator = t.Optional(
	CountryCodeArrayValidator,
);

/**
 * Zod Validators
 */
export const CountryCodeZodValidator = z.enum(COUNTRY_CODES, {
	message: 'errors.invalid_country_code',
});

/**
 * Optional country code validator (Zod)
 */
export const OptionalCountryCodeZodValidator =
	CountryCodeZodValidator.optional();

/**
 * Array of country codes validator (Zod)
 */
export const CountryCodeArrayZodValidator = z.array(CountryCodeZodValidator);

/**
 * Optional array of country codes validator (Zod)
 */
export const OptionalCountryCodeArrayZodValidator =
	CountryCodeArrayZodValidator.optional();

/**
 * Utility functions
 */
export const isValidCountryCode = (code: string): code is CountryCode => {
	return COUNTRY_CODES.includes(code as CountryCode);
};

export const validateCountryCode = (code: string): CountryCode => {
	if (!isValidCountryCode(code)) {
		throw new Error(`Invalid country code: ${code}`);
	}
	return code;
};

export const getCountryCodesList = (): readonly CountryCode[] => {
	return COUNTRY_CODES;
};
