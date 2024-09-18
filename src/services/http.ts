import { getTokenFromLocalStorage } from '@/utils/local_storage';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const TEN_SECONDS = 1000 * 10;

class HttpService {
	axiosInstance: AxiosInstance;
	private accessToken: string;
	private refreshToken: string;

	public constructor() {
		this.accessToken = getTokenFromLocalStorage('access_token') ?? '';
		this.refreshToken = getTokenFromLocalStorage('refresh_token') ?? '';

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
					config.headers.authorization = this.accessToken;
					return config;
				}
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);

		this.axiosInstance.interceptors.response.use((response) => {
			console.log(response.config);
		});
	}
}

const httpService = new HttpService().axiosInstance;

export default httpService;
