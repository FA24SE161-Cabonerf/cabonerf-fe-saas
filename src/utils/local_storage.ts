import { tUser } from '@/@types/user.type';

export const getTokenFromLocalStorage = (tokenType: 'refresh_token' | 'access_token'): string | null => {
	try {
		return localStorage.getItem(tokenType);
	} catch (error) {
		console.error(`Error retrieving ${tokenType} from localStorage:`, error);
		return null;
	}
};

export const getUserProfileFromLocalStorage = (): Omit<tUser, 'phone' | 'bio' | 'address'> | null => {
	try {
		const userProfile = localStorage.getItem('user_profile');
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
export const clearTokenInLocalStorage = (tokenType?: 'refresh_token' | 'access_token'): void => {
	try {
		if (tokenType) {
			localStorage.removeItem(tokenType);
		} else {
			localStorage.clear();
		}
	} catch (error) {
		console.error('Error clearing localStorage:', error);
	}
};
