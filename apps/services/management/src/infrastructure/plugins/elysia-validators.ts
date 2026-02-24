import { parsePhoneNumber } from 'awesome-phonenumber';
import { FormatRegistry } from 'elysia/type-system';

// Register exactly once, as early as possible (before you compile any schemas)
FormatRegistry.Set('phone', (value: string) => {
	const parsed = parsePhoneNumber(value);
	return parsed.valid && parsed.possible && !!parsed.regionCode;
});
FormatRegistry.Set('phone-optional', (value?: string) => {
	if ((value && value.length === 0) || !value) return true;
	const parsed = parsePhoneNumber(value);
	return parsed.valid && parsed.possible && !!parsed.regionCode;
});
