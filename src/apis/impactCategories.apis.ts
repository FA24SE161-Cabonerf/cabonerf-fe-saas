import { CommonResponse } from '@/@types/common.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { IMPACT_METHOD_CATEGORIES_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

class ImpactCategoryApis {
	public getImpactCategoriesByImpactMethodID(payload: { id: string }) {
		return httpService.get<CommonResponse<ImpactCategory[]>>(
			IMPACT_METHOD_CATEGORIES_ENDPOINT.GET_IMPACT_CATEGORIES_BY_METHOD_ID(payload.id)
		);
	}
}

export default ImpactCategoryApis;
