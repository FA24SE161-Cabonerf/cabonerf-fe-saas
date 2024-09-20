//data
//message
//status
export type tCommonResponse<T> = {
	status: string;
	message: string;
	data: T;
};

export type tJWTPayload = {
	user_verify_status: number;
	token_type: number;
	sub: string;
	iat: number;
	exp: null;
};
