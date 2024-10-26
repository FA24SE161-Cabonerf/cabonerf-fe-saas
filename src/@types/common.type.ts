//data
//message
//status
export type CommonResponse<T> = {
	status: string;
	message: string;
	data: T;
};

export type JWTPayload = {
	user_verify_status: number;
	token_type: number;
	sub: string;
	iat: number;
	exp: null;
};
