type tRole = {
	id: number;
	name: string;
};

type tSubscription = {
	id: number;
	subsciptionName: string;
	description: string;
	canCreateOrganize: boolean;
	projectLimit: number;
	storageLimit: number;
	annualCost: number;
	monthlyCost: number;
	canImportExcel: boolean;
};

type tUserVerifyStatus = {
	id: number;
	statusName: string;
	description: string;
};

type tUserStatus = {
	id: string;
	statusName: string;
	description: string;
};

export type tUser = {
	id: number;
	fullName: string;
	email: string;
	phone: string;
	address: string;
	subcription: tSubscription;
	userVerifyStatus: tUserVerifyStatus;
	profilePictureUrl: string;
	userStatus: tUserStatus;
	bio: string;
	role: tRole;
};
