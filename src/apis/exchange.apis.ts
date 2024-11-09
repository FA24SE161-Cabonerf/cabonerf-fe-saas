import { CommonResponse } from '@/@types/common.type';
import { CreateElementaryExchange } from '@/@types/exchange.type';
import { EXCHANGE_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export class ExchangeApis {
	public async createElementaryExchange(payload: CreateElementaryExchange) {}

	public async deleteElementaryExchange(payload: { id: string }) {
		return httpService.delete<CommonResponse<[]>>(EXCHANGE_ENDPOINT.EXCHANGE + `/${payload.id}`);
	}
}
