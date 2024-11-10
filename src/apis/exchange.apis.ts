import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CommonResponse } from '@/@types/common.type';
import { CreateElementaryExchange, Unit } from '@/@types/exchange.type';
import { EXCHANGE_ENDPOINT, UNIT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export class ExchangeApis {
	public async createElementaryExchange(payload: CreateElementaryExchange) {
		return httpService.post<CommonResponse<CabonerfNodeData>>(
			EXCHANGE_ENDPOINT.EXCHANGE + EXCHANGE_ENDPOINT.ELEMENTARY_EXCHANGE,
			payload
		);
	}

	public async deleteElementaryExchange(payload: { id: string }) {
		return httpService.delete<CommonResponse<CabonerfNodeData>>(`${EXCHANGE_ENDPOINT.EXCHANGE}/${payload.id}`);
	}

	public async getUnitsByUnitGroupId(payload: { id: string }) {
		return httpService.get<CommonResponse<Unit[]>>(`${UNIT.UNIT_GROUP}/${payload.id}${UNIT.UNIT}`);
	}
}
