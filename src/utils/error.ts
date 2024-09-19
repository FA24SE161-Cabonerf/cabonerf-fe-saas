import { AxiosError, HttpStatusCode, isAxiosError } from 'axios';

export function isUnauthorization<T>(error: unknown): error is AxiosError<T> {
	return isAxiosError(error) && error.response?.status === HttpStatusCode.Unauthorized;
}

export function isUnprocessableEntity<T>(error: unknown): error is AxiosError<T> {
	return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity;
}
