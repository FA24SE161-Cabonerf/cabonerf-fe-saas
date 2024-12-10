type IndustryCode = {
	id: string;
	code: string;
	name: string;
};

type Organization = {
	id: string;
	name: string;
	description: string | null;
	taxCode: string | null;
	industryCodes: IndustryCode[];
	logo: string;
	contract: null;
};

type OrgMember = {
	id: string;
	user: {
		id: string;
		fullName: string;
		email: string;
		profilePictureUrl: string;
	};
	role: {
		id: string;
		name: string;
	};
	hasJoined: boolean;
};

export type { Organization, OrgMember, IndustryCode };
