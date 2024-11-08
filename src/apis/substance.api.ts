import { CommonResponse } from '@/@types/common.type';
import { EmissionSubstance } from '@/@types/emissionSubstance.type';
import { EMISSION_SUBSTANCES_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

interface QueryParams {
	pageParam: number;
	pageCurrent: number;
	methodId: string;
	keyword?: string;
	input: string;
}

export class EmissionSubstancesApis {
	public async getEmissionSubstances({ pageParam }: { pageParam: number }) {
		const response = await httpService.get<
			CommonResponse<{
				pageCurrent: number;
				pageSize: number;
				totalPage: number;
				list: EmissionSubstance[];
			}>
		>(
			EMISSION_SUBSTANCES_ENDPOINT.EMISSION_SUBSTANCES +
				`?methodId=923e4567-e89b-12d3-a456-426614174000&pageCurrent=${pageParam}&pageSize=6&input=false`
		);

		return response.data.data;
	}
}
