import { tAuthenicationResponse } from '@/@types/authentication.type';
import { tCommonResponse } from '@/@types/common.type';
import httpService from '@/services/http';

export const authenticationApis = {
	login: (payload: { email: string; password: string }) => {
		return httpService.post<tCommonResponse<tAuthenicationResponse>>('/api/v1/login', payload);
	},
};
