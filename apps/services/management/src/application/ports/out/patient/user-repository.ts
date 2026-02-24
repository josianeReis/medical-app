import { Pagination } from '@/domain/entities/pagination';

import { User } from '@/domain/entities/user';

export type UpdatePatientData = {
	name?: string;
	document?: string;
	documentType?: string;
	gender?: string;
	birthdate?: string;
	phoneNumber?: string;
	secondPhoneNumber?: string;
	userId?: string | null;
	updatedById?: string;
};

export type UserFilters = {
	[key: string]: unknown;
} & Partial<User>;

export type CreateUserDTO = {
	email: string;
	username?: string;
	name: string;
	firstName: string;
	lastName: string;
	terms: boolean;
};

export type CreateUserResponse = {
	data?: { user: User };
	error?: unknown;
};

export type UserRepository = {
	/**
	 * Creates a new user.
	 * @param data - The user data to create.
	 * @returns Promise resolving to the creation response with user data or error.
	 */
	create(data: CreateUserDTO): Promise<CreateUserResponse>;
	/**
	 * Finds a user by their ID.
	 * @param id - The ID of the user to find.
	 * @returns Promise resolving to the user if found, null otherwise.
	 */
	findById(id: string): Promise<User | null>;
	/**
	 * Finds a user by their email address.
	 * @param email - The email address to search for.
	 * @returns Promise resolving to the user if found, null otherwise.
	 */
	findByEmail(email: string): Promise<User | null>;
	/**
	 * Finds all users in an organization with optional filtering and pagination.
	 * @param organizationId - The ID of the organization to search in.
	 * @param filters - Optional filters to apply to the search.
	 * @param pagination - Pagination parameters for the results.
	 * @returns Promise resolving to an array of users.
	 */
	findAll(
		organizationId: string,
		filters: UserFilters,
		pagination: Pagination,
	): Promise<User[]>;
	/**
	 * Bans a user by their ID.
	 * @param id - The ID of the user to ban.
	 * @param banReason - The reason for banning the user.
	 * @returns Promise resolving to the banned user if successful, null otherwise.
	 */
	banUser(id: string, banReason: string): Promise<User | null>;
	/**
	 * Soft deletes a user by their ID.
	 * @param id - The ID of the user to soft delete.
	 * @param deletedBy - The ID of the user who soft deleted the user.
	 * @returns Promise resolving to the soft deleted user if successful, null otherwise.
	 */
	softDelete(id: string, deletedBy: string): Promise<User | null>;
};
