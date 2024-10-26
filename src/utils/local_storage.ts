import { User } from '@/@types/user.type';

export enum TOKEN_KEY_NAME {
	ACCESS_TOKEN = 'access_token',
	REFRESH_TOKEN = 'refresh_token',
}

export const USER_PROFILE_KEY_NAME = 'user_profile';

export const insertUserToLocalStorage = (user: Omit<User, 'phone' | 'bio' | 'address'>) => {
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

export const getUserProfileFromLocalStorage = (): Omit<User, 'phone' | 'bio' | 'address'> | null => {
	try {
		const userProfile = localStorage.getItem(USER_PROFILE_KEY_NAME);
		if (!userProfile) {
			return null;
		}
		return JSON.parse(userProfile);
	} catch (error) {
		console.error('Error parsing user profile from localStorage:', error);
		return null;
	}
};

// Utility function to clear specific tokens or the entire localStorage
export const clearResouceInLocalStorage = (): void => {
	localStorage.removeItem(TOKEN_KEY_NAME.ACCESS_TOKEN);
	localStorage.removeItem(TOKEN_KEY_NAME.REFRESH_TOKEN);
	localStorage.removeItem(USER_PROFILE_KEY_NAME);
};
