import { tAuthenicationResponse } from '@/@types/authentication.type';
import { tCommonResponse } from '@/@types/common.type';
import { AUTH_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export const authenticationApis = {
	login: (payload: { email: string; password: string }) => {
		return httpService.post<tAuthenicationResponse>(AUTH_ENDPOINT.LOGIN, payload);
	},
	register: (payload: { email: string; fullName: string; password: string; confirmPassword: string }) => {
		return httpService.post<tAuthenicationResponse>(AUTH_ENDPOINT.REGISTER, payload);
	},
	logout: (payload: { refreshToken: string }) => {
		return httpService.post<tCommonResponse<''>>(AUTH_ENDPOINT.LOGOUT, {
			refreshToken: `Bearer ${payload.refreshToken}`,
		});
	},
	verifyEmail: (payload: { token: string }) => {
		return httpService.post<tAuthenicationResponse>(AUTH_ENDPOINT.VERIFY_EMAIL, {
			token: `Bearer ${payload.token}`,
		});
	},
};
