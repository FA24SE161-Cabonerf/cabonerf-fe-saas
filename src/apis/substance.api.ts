import { CommonResponse } from '@/@types/common.type';
import { EmissionSubstanceSearch } from '@/@types/emissionSubstance.type';
import { EMISSION_SUBSTANCES_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http.tsx';

interface QueryParams {
	pageCurrent?: number;
	pageSize?: number;
	methodId?: string;
	keyword?: string;
	input?: string;
	impactCategoryId?: string;
	emissionCompartmentId?: string;
}

export class EmissionSubstancesApis {
	public async getEmissionSubstances(_queryParams: QueryParams) {
		const response = await httpService.get<
			CommonResponse<{
				pageCurrent: number;
				pageSize: number;
				totalPage: number;
				list: EmissionSubstanceSearch[];
			}>
		>(EMISSION_SUBSTANCES_ENDPOINT.EMISSION_SUBSTANCES, {
			params: _queryParams,
		});

		return response.data.data;
	}
}
