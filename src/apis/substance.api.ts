import { CommonResponse } from '@/@types/common.type';
import { EmissionSubstances } from '@/@types/emissionSubstance.type';
import { EMISSION_SUBSTANCES_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export class EmissionSubstancesApis {
	public async getEmissionSubstances({ pageParam }) {
		const response = await httpService.get<
			CommonResponse<{
				pageCurrent: number;
				pageSize: number;
				totalPage: number;
				list: EmissionSubstances[];
			}>
		>(
			EMISSION_SUBSTANCES_ENDPOINT.EMISSION_SUBSTANCES +
				`?methodId=923e4567-e89b-12d3-a456-426614174000&pageCurrent=${pageParam}&pageSize=6`
		);

		return response.data.data;
	}
}
