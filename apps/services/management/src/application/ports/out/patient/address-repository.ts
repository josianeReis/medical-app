import { Address, CreateAddressData } from '@/domain/entities/address';
import { Pagination } from '@/domain/entities/pagination';

export type UpdateAddressData = Partial<Omit<CreateAddressData, 'patientId'>>;
export type CreateAddressDTO = Omit<
	CreateAddressData,
	'number' | 'complement' | 'neighborhood' | 'patientId'
> & {
	number?: string;
	complement?: string;
	neighborhood?: string;
};
export type AddressRepository = {
	/**
	 * Creates multiple addresses for a patient.
	 * @param patientId - The ID of the patient to create addresses for.
	 * @param data - Array of address data to create.
	 * @returns Promise resolving to an array of created addresses.
	 */
	create(patientId: string, data: CreateAddressDTO[]): Promise<Address[]>;
	/**
	 * Updates an existing address.
	 * @param id - The ID of the address to update.
	 * @param data - The data to update the address with.
	 * @returns Promise resolving to the updated address.
	 */
	update(id: string, data: UpdateAddressData): Promise<Address>;
	/**
	 * Deletes an address by its ID.
	 * @param id - The ID of the address to delete.
	 * @returns Promise that resolves when the address is deleted.
	 */
	delete(id: string): Promise<void>;
	/**
	 * Finds an address by its ID.
	 * @param id - The ID of the address to find.
	 * @returns Promise resolving to the address if found, undefined otherwise.
	 */
	findById(id: string): Promise<Address | undefined>;
	/**
	 * Finds all addresses for a specific patient.
	 * @param patientId - The ID of the patient to find addresses for.
	 * @param pagination - Optional pagination parameters for the results.
	 * @returns Promise resolving to an array of addresses for the patient.
	 */
	findByPatient(patientId: string, pagination?: Pagination): Promise<Address[]>;
};
