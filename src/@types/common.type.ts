//data
//message
//status
export type tCommonResponse<T> = {
	status: string;
	message: string;
	data: T;
};
