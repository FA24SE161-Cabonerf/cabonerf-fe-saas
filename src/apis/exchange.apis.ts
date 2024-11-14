import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CommonResponse } from '@/@types/common.type';
import { CreateElementaryExchange, CreateProductExchange, Exchange, Unit } from '@/@types/exchange.type';
import { Impact } from '@/@types/project.type';
import { EXCHANGE_ENDPOINT, UNIT } from '@/constants/api.endpoint';
import httpService from '@/services/http.tsx';

export class ExchangeApis {
	public async createElementaryExchange(payload: CreateElementaryExchange) {
		return httpService.post<CommonResponse<Exchange[]>>(EXCHANGE_ENDPOINT.EXCHANGE + EXCHANGE_ENDPOINT.ELEMENTARY_EXCHANGE, payload);
	}

	public async createProductExchange(payload: CreateProductExchange) {
		return httpService.post<CommonResponse<Exchange[]>>(EXCHANGE_ENDPOINT.EXCHANGE + EXCHANGE_ENDPOINT.PRODUCT_EXCHANGE, payload);
	}

	public async updateElementaryExchange(id: string, payload: { processId: string; unitId: string; value: number }) {
		return httpService.patch<
			CommonResponse<{
				impacts: Omit<Impact & { unitLevel: number; systemLevel: number; overallImpactContribution: number }, 'value'>[];
				exchange: Exchange;
			}>
		>(`${EXCHANGE_ENDPOINT.EXCHANGE}${EXCHANGE_ENDPOINT.ELEMENTARY_EXCHANGE}/${id}`, payload);
	}

	public async deleteElementaryExchange(payload: { id: string }) {
		return httpService.delete<
			CommonResponse<{
				impacts: Omit<Impact & { unitLevel: number; systemLevel: number; overallImpactContribution: number }, 'value'>[];
				exchange: Exchange;
			}>
		>(`${EXCHANGE_ENDPOINT.EXCHANGE}${EXCHANGE_ENDPOINT.ELEMENTARY_EXCHANGE}/${payload.id}`);
	}

	public async deleteProductExchange(payload: { id: string }) {
		return httpService.delete<CommonResponse<Exchange[]>>(
			`${EXCHANGE_ENDPOINT.EXCHANGE}${EXCHANGE_ENDPOINT.PRODUCT_EXCHANGE}/${payload.id}`
		);
	}

	public async getUnitsByUnitGroupId(payload: { id: string }) {
		return httpService.get<CommonResponse<Unit[]>>(`${UNIT.UNIT_GROUP}/${payload.id}${UNIT.UNIT}`);
	}

	public async updateProductExchange(
		id: string,
		payload: {
			name: string;
			unitId: string;
			value: number;
			processId: string;
		}
	) {
		return httpService.patch<CommonResponse<Exchange[]>>(
			`${EXCHANGE_ENDPOINT.EXCHANGE}${EXCHANGE_ENDPOINT.PRODUCT_EXCHANGE}/${id}`,
			payload
		);
	}
}
