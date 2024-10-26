type Role = {
	id: string;
	name: string;
};

type Subscription = {
	id: string;
	subsciptionName: string;
	description: string;
	canCreateOrganize: boolean;
	projectLimit: number;
	storageLimit: number;
	annualCost: number;
	monthlyCost: number;
	canImportExcel: boolean;
};

type UserVerifyStatus = {
	id: string;
	statusName: string;
	description: string;
};

type UserStatus = {
	id: string;
	statusName: string;
	description: string;
};

export type User = {
	id: string;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	subcription: Subscription;
	userVerifyStatus: UserVerifyStatus;
	profilePictureUrl: string;
	userStatus: UserStatus;
	bio: string;
	role: Role;
};
