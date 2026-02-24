import { MemberRole as MemberRoleAuth } from '@packages/auth-config';

declare global {
	type MemberRole = MemberRoleAuth;

	type Organization = {
		name: string;
		slug: string;
		logo: string | null;
		createdAt: string;
		metadata: string | null;
		id: string;
		invitations: Invitation[];
		members: Member[];
		teams?: Team[];
	};

	type OrganizationMetadata = {
		cep?: string;
		address?: string;
		number?: string;
		city?: string;
		state?: string;
		country?: string;
		cnpj?: string;
		cpf?: string;
	};

	type Invitation = {
		organizationId: string;
		email: string;
		role: MemberRole;
		teamId: string | null;
		status: 'pending' | 'accepted' | 'declined' | string;
		expiresAt: string;
		inviterId: string;
		id: string;
	};

	type Member = {
		organizationId: string;
		userId: string;
		role: MemberRole;
		teamId: string | null;
		createdAt: string;
		id: string;
		user: User;
	};

	type User = {
		id: string;
		name: string;
		email: string;
		emailVerified: boolean;
		image?: string | null;
		createdAt: string | Date;
		updatedAt: string | Date;
		username?: string;
		displayUsername?: string;
		role?: 'user' | 'admin' | string;
		banned?: boolean | null;
		banReason?: string | null;
		banExpires?: string | null;
		firstName: string;
		lastName: string;
		language: Languages;
		members?: Member[];
	};

	type Team = {
		name: string;
		organizationId: string;
		createdAt: string;
		updatedAt: string | null;
		id: string;
	};

	type ActiveMember = {
		user: {
			id: string;
			name: string;
			email: string;
			image: string | null | undefined;
		};
		id: string;
		createdAt: Date;
		userId: string;
		organizationId: string;
		role: MemberRole;
		teamId?: string | undefined;
	};

	type Languages = 'pt' | 'en' | 'es';

	type Procedure = {
		id: string;
		name: string;
		code?: number | null;
		duration?: number | null;
		equipament?: string | null;
		createdAt: Date;
		updatedAt: Date;
		organizationId: string;
	};

	type Template = {
		id: string;
		name: string;
		content: string;
		procedureId: string;
		active: boolean;
		createdAt: Date;
		updatedAt: Date;
		organizationId: string;
		procedure: Procedure;
	};

	type Patient = {
		type: ReactNode;
		id: string;
		name: string;
		email: string;
		gender?: null | string;
		birthdate: string;
		phoneNumber: string;
		secondPhoneNumber?: null;
		deletedAt?: null;
		deletedBy?: null;
		createdBy: string;
		updatedBy?: null;
		createdAt: Date;
		updatedAt: Date;
		user: User;
		documents: PatientDocument[];
		addresses: any[];
	};

	type PatientDocument = {
		document_type: string;
		id: string;
		patientId: string;
		type: string;
		number: string;
		issuedAt?: null | string;
		expiresAt?: null | string;
		createdAt: Date;
		updatedAt: Date;
	};

	type APIReturn<T> = {
		data: T;
		error: any;
	};

	interface PaginatedReturn<T> {
		items: T;
		meta: Meta;
		_links: Links;
	}

	interface Links {
		self: string;
		first: string;
		prev: null;
		next: null;
		last: string;
	}

	interface Meta {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	}

	// Added PrintMask type for print mask management.
	type PrintMask = {
		id: string;
		name: string;
		headerHtml?: string | null;
		footerHtml?: string | null;
		active: boolean;
		createdAt: Date;
		updatedAt: Date;
		organizationId: string;
	};

	// Added Report type for reports management.
	type MedicalReport = {
		id: string;
		patientId: string;
		doctorId: string;
		reviewedById?: string | null;
		procedureId: string;
		templateId: string;
		printMaskId: string;
		htmlContent?: string | null;
		pdfUrl?: string | null;
		status: 'draft' | 'review' | 'published' | string;
		publishedAt?: Date | null;
		createdAt: Date;
		updatedAt: Date;
		organizationId: string;

		// Relations (optional)
		patient?: Patient;
		doctor?: User;
		reviewedBy?: User | null;
		procedure?: Procedure;
		template?: Template;
		printMask?: PrintMask;
	};
}
