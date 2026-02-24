import { Filter } from './build-drizzle-where';

/**
 * Parsed query result with standardized format
 */
export interface ParsedQuery {
	pagination: {
		page: number;
		limit: number;
	};
	filters: Filter[];
	requestQuery: Record<string, unknown>;
	sort?: string;
	fullTextSearch?: {
		query: string;
		fields: string[];
	};
}

/**
 * Configuration for full-text search
 */
export interface FullTextSearchConfig {
	/** Fields to search in for full-text queries */
	searchFields: string[];
	/** Minimum query length (default: 2) */
	minLength?: number;
}

/**
 * Query parsing options
 */
export interface QueryParserOptions {
	/** Default page size (default: 10) */
	defaultLimit?: number;
	/** Maximum page size (default: 100) */
	maxLimit?: number;
	/** Full-text search configuration */
	fullTextSearch?: FullTextSearchConfig;
	/** Fields to exclude from simple filter conversion */
	excludeFromFilters?: string[];
}

/**
 * Parse query parameters into standardized format
 */
export function parseQuery(
	query: Record<string, unknown>,
	options: QueryParserOptions = {},
): ParsedQuery {
	const {
		defaultLimit = 10,
		maxLimit = 100,
		fullTextSearch,
		excludeFromFilters = ['page', 'limit', 'filters', 'sort', 'q'],
	} = options;

	const {
		page = 1,
		limit = defaultLimit,
		filters: filtersQuery,
		sort,
		q: fullTextQuery,
		...simpleFilters
	} = query as {
		page?: number;
		limit?: number;
		filters?: string;
		sort?: string;
		q?: string;
		[key: string]: unknown;
	};

	// Parse pagination
	const parsedPage = Math.max(1, Number(page) || 1);
	const parsedLimit = Math.min(
		maxLimit,
		Math.max(1, Number(limit) || defaultLimit),
	);

	// Parse filters
	const allFilters: Filter[] = [];

	// Handle complex filters from JSON
	if (filtersQuery && typeof filtersQuery === 'string') {
		try {
			const complexFilters = JSON.parse(decodeURIComponent(filtersQuery));
			if (Array.isArray(complexFilters)) {
				allFilters.push(...complexFilters);
			}
		} catch {
			// Silently fail for invalid JSON
		}
	}

	// Convert simple query parameters to filters
	for (const [key, value] of Object.entries(simpleFilters)) {
		if (value && !excludeFromFilters.includes(key)) {
			// Handle array values (use 'in' operator)
			if (Array.isArray(value) && value.length > 0) {
				// Filter out empty strings and null values
				const cleanValues = value.filter(
					(v) => v && typeof v === 'string' && v.trim() !== '',
				);
				if (cleanValues.length > 0) {
					allFilters.push({
						field: key,
						operator: 'in',
						value: cleanValues,
					});
				}
			}
			// Handle string values that might be JSON arrays
			else if (typeof value === 'string' && value.trim() !== '') {
				// Try to parse as JSON array first (for array parameters passed as strings)
				if (value.trim().startsWith('[') && value.trim().endsWith(']')) {
					try {
						const parsedArray = JSON.parse(value.trim());
						if (Array.isArray(parsedArray) && parsedArray.length > 0) {
							const cleanValues = parsedArray.filter(
								(v) => v && typeof v === 'string' && v.trim() !== '',
							);
							if (cleanValues.length > 0) {
								allFilters.push({
									field: key,
									operator: 'in',
									value: cleanValues,
								});
								continue;
							}
						}
					} catch {
						// If parsing fails, treat as regular string
					}
				}

				// Handle as regular string value (use 'ilike' operator for text search)
				allFilters.push({
					field: key,
					operator: 'ilike',
					value: `%${value.trim()}%`,
				});
			}
		}
	}

	// Parse full-text search
	let parsedFullTextSearch: ParsedQuery['fullTextSearch'];
	if (
		fullTextQuery &&
		typeof fullTextQuery === 'string' &&
		fullTextSearch?.searchFields?.length &&
		fullTextQuery.trim().length >= (fullTextSearch.minLength || 2)
	) {
		parsedFullTextSearch = {
			query: fullTextQuery.trim(),
			fields: fullTextSearch.searchFields,
		};
	}

	return {
		pagination: {
			page: parsedPage,
			limit: parsedLimit,
		},
		filters: allFilters,
		requestQuery: query,
		sort: typeof sort === 'string' ? sort : undefined,
		fullTextSearch: parsedFullTextSearch,
	};
}

/**
 * Convert full-text search to filters for ilike-based search
 */
export function convertFullTextToFilters(
	fullTextSearch: NonNullable<ParsedQuery['fullTextSearch']>,
): Filter[] {
	const { query, fields } = fullTextSearch;
	const searchValue = `%${query}%`;

	return fields.map((field) => ({
		field,
		operator: 'ilike' as const,
		value: searchValue,
	}));
}

/**
 * Combine filters with full-text search filters
 * Note: Full-text search filters need to be handled separately in the repository layer
 */
export function combineFiltersWithFullText(
	baseFilters: Filter[],
	fullTextSearch?: ParsedQuery['fullTextSearch'],
): Filter[] {
	if (!fullTextSearch) {
		return baseFilters;
	}

	// For now, return base filters and let the use case handle full-text search
	// Full-text search will be implemented at the repository level using OR conditions
	return baseFilters;
}

/**
 * Create standardized query result for use cases
 */
export function createUseCaseQuery(
	parsedQuery: ParsedQuery,
	requestQuery: Record<string, unknown>,
	organizationId: string,
	baseUrl: string,
): {
	organizationId: string;
	filters: Filter[];
	requestQuery: Record<string, unknown>;
	pagination: { page: number; limit: number };
	sort?: string;
	baseUrl: string;
	fullTextSearch?: ParsedQuery['fullTextSearch'];
} {
	return {
		organizationId,
		filters: parsedQuery.filters,
		requestQuery,
		pagination: parsedQuery.pagination,
		sort: parsedQuery.sort,
		baseUrl,
		fullTextSearch: parsedQuery.fullTextSearch,
	};
}

/**
 * Preset configurations for common entities
 */
export const QueryConfigs = {
	/**
	 * Configuration for patient queries
	 */
	patients: {
		defaultLimit: 10,
		maxLimit: 100,
		fullTextSearch: {
			searchFields: ['name', 'email', 'phoneNumber'],
			minLength: 2,
		},
		excludeFromFilters: ['page', 'limit', 'filters', 'sort', 'q'],
	} as QueryParserOptions,

	/**
	 * Configuration for procedure queries
	 */
	procedures: {
		defaultLimit: 10,
		maxLimit: 100,
		fullTextSearch: {
			searchFields: ['name', 'description'],
			minLength: 2,
		},
		excludeFromFilters: ['page', 'limit', 'filters', 'sort', 'q'],
	} as QueryParserOptions,

	/**
	 * Configuration for category queries
	 */
	categories: {
		defaultLimit: 10,
		maxLimit: 100,
		fullTextSearch: {
			searchFields: ['name', 'description'],
			minLength: 2,
		},
		excludeFromFilters: ['page', 'limit', 'filters', 'sort', 'q'],
	} as QueryParserOptions,

	/**
	 * Configuration for template queries
	 */
	templates: {
		defaultLimit: 10,
		maxLimit: 100,
		fullTextSearch: {
			searchFields: ['name', 'content'],
			minLength: 2,
		},
		excludeFromFilters: ['page', 'limit', 'filters', 'sort', 'q'],
	} as QueryParserOptions,

	/**
	 * Configuration for appointment queries
	 */
	appointments: {
		defaultLimit: 20,
		maxLimit: 200,
		fullTextSearch: {
			searchFields: ['patientId', 'doctorId'],
			minLength: 2,
		},
		excludeFromFilters: ['page', 'limit', 'filters', 'sort', 'q'],
	} as QueryParserOptions,
} as const;
