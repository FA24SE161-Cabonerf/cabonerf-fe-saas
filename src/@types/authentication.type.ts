import { CommonResponse } from '@/@types/common.type';
import { User } from '@/@types/user.type';

export type AuthenicationResponse = CommonResponse<{
	access_token: string;
	refresh_token: string;
	user: Omit<User, 'phone' | 'bio' | 'address'>;
}>;
