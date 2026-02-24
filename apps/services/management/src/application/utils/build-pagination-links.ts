import {
	DefaultResponse,
	defaultResponse,
} from '@/domain/shared/default-response';

export type PaginationLinks = {
	self: string;
	first: string;
	prev: string | null;
	next: string | null;
	last: string;
};

export type PaginatedValues<
	Data,
	Filters = Record<string, unknown> | unknown[],
> = {
	items: Data;
	baseUrl: string;
	page: number;
	totalPages: number;
	filters: Filters;
	limit: number;
};

/**
 * Builds a `_links` object containing HATEOAS pagination links.
 * It preserves the original query-string filters while replacing `page` and `limit`.
 *
 * @param baseUrl - The base URL for the pagination links without query parameters.
 *   This should be the endpoint path (e.g., '/api/patients').
 * @param page - The current page number in the pagination sequence.
 *   Must be a positive integer starting from 1.
 * @param totalPages - The total number of pages available based on the dataset size and page limit.
 *   Must be a positive integer greater than or equal to 1.
 * @param filters - The original query parameters and filters to preserve across pagination links.
 *   These will be merged with the pagination parameters (page, limit).
 * @param limit - The maximum number of items to return per page.
 *   Must be a positive integer.
 * @returns A `PaginationLinks` object containing HATEOAS pagination links.
 */
export function buildPaginationResponse<
	Data,
	Filters = Record<string, unknown>,
>({
	items,
	baseUrl,
	page,
	totalPages,
	filters = {} as Filters,
	limit = 10,
	total,
}: PaginatedValues<Data, Filters> & { total: number }): DefaultResponse<
	PaginatedResponse<Data>,
	null
> {
	const buildUrl = (p: number) => {
		const params = new URLSearchParams({
			...(filters as Record<string, string | undefined>),
			page: p.toString(),
			limit: limit.toString(),
		});
		return `${baseUrl}?${params.toString()}`;
	};

	const _links: PaginationLinks = {
		self: buildUrl(page),
		first: buildUrl(1),
		prev: page > 1 ? buildUrl(page - 1) : null,
		next: page < totalPages ? buildUrl(page + 1) : null,
		last: buildUrl(totalPages),
	};

	return defaultResponse({
		items,
		meta: {
			page,
			limit,
			total,
			totalPages,
		},
		_links,
	});
}

export type PaginationMeta = {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
};

export type PaginatedResponse<Data> = {
	items: Data;
	meta: PaginationMeta;
	_links: PaginationLinks;
};
