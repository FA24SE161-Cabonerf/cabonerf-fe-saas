import { tCommonResponse } from '@/@types/common.type';
import { tUser } from '@/@types/user.type';

export type tAuthenicationResponse = tCommonResponse<{
	access_token: string;
	refresh_token: string;
	user: Omit<tUser, 'phone' | 'bio' | 'address'>;
}>;
