import { User } from '@/@types/user.type';

export enum TOKEN_KEY_NAME {
	ACCESS_TOKEN = 'access_token',
	REFRESH_TOKEN = 'refresh_token',
}

export const USER_PROFILE_KEY_NAME = 'user_profile';

export const insertUserToLocalStorage = (user: User) => {
	const user_profile_converted = JSON.stringify(user);
	return localStorage.setItem(USER_PROFILE_KEY_NAME, user_profile_converted);
};

export const insertTokenToLocalStorage = (tokenType: TOKEN_KEY_NAME, token: string) => {
	return localStorage.setItem(tokenType, token);
};

export const getTokenFromLocalStorage = (tokenType: TOKEN_KEY_NAME): string | null => {
	try {
		return localStorage.getItem(tokenType);
	} catch (error) {
		console.error(`Error retrieving ${tokenType} from localStorage:`, error);
		return null;
	}
};

export const getUserProfileFromLocalStorage = (): User | null => {
	const userProfileData = localStorage.getItem(USER_PROFILE_KEY_NAME);
	if (!userProfileData) {
		return null;
	}

	try {
		return JSON.parse(userProfileData);
	} catch (error) {
		console.error('Failed to parse user profile from local storage:', error);
		return null;
	}
};

export const saveCurrentOrganizationToLocalStorage = (org: { orgId: string; orgName: string }) => {
	const orgInfo = JSON.stringify(org);
	return localStorage.setItem('organization', orgInfo);
};

export const getCurrentOrganizationFromLocalStorage = (): { orgId: string; orgName: string } | null => {
	const org = localStorage.getItem('organization');

	if (!org) {
		return null;
	}

	try {
		return JSON.parse(org);
	} catch (error) {
		console.error('Failed to parse user profile from local storage:', error);
		return null;
	}
};

// Utility function to clear specific tokens or the entire localStorage
export const clearResouceInLocalStorage = (): void => {
	localStorage.removeItem(TOKEN_KEY_NAME.ACCESS_TOKEN);
	localStorage.removeItem(TOKEN_KEY_NAME.REFRESH_TOKEN);
	localStorage.removeItem(USER_PROFILE_KEY_NAME);
	localStorage.removeItem('organization');
};
