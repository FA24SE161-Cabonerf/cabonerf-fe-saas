import { AuthenicationResponse } from '@/@types/authentication.type';
import { CommonResponse } from '@/@types/common.type';
import { AUTH_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http.tsx';

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
	changePassword: (payload: { oldPassword: string; newPassword: string; newPasswordConfirm: string }) => {
		return httpService.put<CommonResponse<''>>('users/password', payload);
	},
	updateProfile: (payload: { bio?: string; fullName?: string; phone?: string }) => {
		return httpService.put<
			CommonResponse<{
				id: string;
				fullName: string;
				email: string;
				phone: string;
				profilePictureUrl: string;
				bio: string;
				role: {
					id: string;
					name: string;
				};
				userVerifyStatus: {
					id: string;
					statusName: string;
					description: string;
				};
			}>
		>('users/profile', payload);
	},
	uploadFile: (body: FormData) => {
		return httpService.put<CommonResponse<{ profilePictureUrl: string }>>('users/avatar', body, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
};
