import { tAuthenicationResponse } from '@/@types/authentication.type';
import { tCommonResponse } from '@/@types/common.type';
import ApiPaths from '@/constants/api.paths';
import httpService from '@/services/http';

export const authenticationApis = {
	login: (payload: { email: string; password: string }) => {
		return httpService.post<tAuthenicationResponse>(ApiPaths.LOGIN, payload);
	},
	register: (payload: { email: string; fullName: string; password: string; confirmPassword: string }) => {
		return httpService.post<tAuthenicationResponse>(ApiPaths.REGISTER, payload);
	},
	logout: (payload: { refreshToken: string }) => {
		return httpService.post<tCommonResponse<''>>(ApiPaths.LOGOUT, {
			refreshToken: `Bearer ${payload.refreshToken}`,
		});
	},
};
