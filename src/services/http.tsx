import { AuthenicationResponse } from '@/@types/authentication.type';
import { AUTH_ENDPOINT } from '@/constants/api.endpoint';
import {
	clearResouceInLocalStorage,
	getTokenFromLocalStorage,
	insertTokenToLocalStorage,
	insertUserToLocalStorage,
	TOKEN_KEY_NAME,
} from '@/utils/local_storage';
import axios, { AxiosInstance, HttpStatusCode, isAxiosError } from 'axios';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_LOCAL_URL;
const TEN_SECONDS = 1000 * 10;

class HttpService {
	axiosInstance: AxiosInstance;
	private accessToken: string;
	private refreshToken: string;

	public constructor() {
		this.accessToken = getTokenFromLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN) ?? '';
		this.refreshToken = getTokenFromLocalStorage(TOKEN_KEY_NAME.REFRESH_TOKEN) ?? '';

		this.axiosInstance = axios.create({
			baseURL: BASE_URL,
			timeout: TEN_SECONDS,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		this.axiosInstance.interceptors.request.use(
			(config) => {
				if (this.accessToken && config.headers) {
					config.headers.authorization = `Bearer ${this.accessToken}`;
					return config;
				}

				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.axiosInstance.interceptors.response.use(
			(response) => {
				const { url } = response.config;

				const data = response.data as AuthenicationResponse;
				const { access_token, refresh_token, user } = data.data;

				switch (url) {
					case AUTH_ENDPOINT.LOGIN:
					case AUTH_ENDPOINT.REGISTER:
					case AUTH_ENDPOINT.VERIFY_EMAIL:
						this.accessToken = access_token;
						this.refreshToken = refresh_token;
						insertTokenToLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN, access_token);
						insertTokenToLocalStorage(TOKEN_KEY_NAME.REFRESH_TOKEN, refresh_token);
						insertUserToLocalStorage(user);
						break;
					case AUTH_ENDPOINT.LOGOUT:
						this.accessToken = '';
						this.refreshToken = '';
						clearResouceInLocalStorage();
						break;
					default:
						break;
				}
				return response;
			},
			(error) => {
				if (isAxiosError(error) && error.status === HttpStatusCode.Unauthorized) {
					toast.error('You will be log out');
					this.accessToken = '';
					this.refreshToken = '';
					clearResouceInLocalStorage();
				}
				return error;
			}
		);
	}
}

const httpService = new HttpService().axiosInstance;

export default httpService;