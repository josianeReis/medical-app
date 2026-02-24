import { MemberWithDetails } from '@/domain/entities/member';

export type MemberRepository = {
	/**
	 * Finds a member by user ID and organization ID.
	 * @param userId - The ID of the user to search for.
	 * @param organizationId - The ID of the organization to search in.
	 * @returns The member with details if found, undefined otherwise.
	 */
	findByUserAndOrganization(
		userId: string,
		organizationId: string,
	): Promise<MemberWithDetails | undefined>;
	/**
	 * Finds a member by user ID.
	 * @param userId - The ID of the user to search for.
	 * @returns The member with details if found, undefined otherwise.
	 */
	findByUserId(userId: string): Promise<MemberWithDetails | undefined>;
	/**
	 * Finds all members in an organization.
	 * @param organizationId - The ID of the organization to search in.
	 * @returns An array of members with details.
	 */
	findByOrganizationId(organizationId: string): Promise<MemberWithDetails[]>;
	/**
	 * Adds a patient to an organization.
	 * @param userId - The ID of the user associated with the patient.
	 * @param organizationId - The ID of the organization to add the patient to.
	 * @returns Promise that resolves when the patient is added to the organization.
	 * @throws {NotFoundError} If the patient is not found.
	 */
	addToOrganization(userId: string, organizationId: string): Promise<void>;
	/**
	 * Removes a user from an organization.
	 * @param userId - The ID of the user to remove.
	 * @param sessionUserId - The ID of the user performing the action.
	 * @param organizationId - The ID of the organization to remove the user from.
	 */
	softDelete(
		userId: string,
		organizationId: string,
		deletedBy: string,
	): Promise<void>;
	/**
	 * Updates the role of a member in an organization.
	 * @param userId - The ID of the user whose role to update.
	 * @param organizationId - The ID of the organization.
	 * @param role - The new role to assign to the member.
	 */
	updateMemberRole(
		userId: string,
		organizationId: string,
		role: string,
	): Promise<void>;
};
