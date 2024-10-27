import { AuthenicationResponse } from '@/@types/authentication.type';
import { CommonResponse } from '@/@types/common.type';
import { AUTH_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export const authenticationApis = {
	login: (payload: { email: string; password: string }) => {
		return httpService.post<AuthenicationResponse>(AUTH_ENDPOINT.LOGIN, payload);
	},
	register: (payload: { email: string; fullName: string; password: string; confirmPassword: string }) => {
		return httpService.post<AuthenicationResponse>(AUTH_ENDPOINT.REGISTER, payload);
	},
	logout: (payload: { refreshToken: string }) => {
		return httpService.post<CommonResponse<''>>(AUTH_ENDPOINT.LOGOUT, {
			refreshToken: `Bearer ${payload.refreshToken}`,
		});
	},
	verifyEmail: (payload: { token: string }) => {
		return httpService.post<AuthenicationResponse>(AUTH_ENDPOINT.VERIFY_EMAIL, {
			token: `Bearer ${payload.token}`,
		});
	},
};
