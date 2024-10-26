import { tCommonResponse } from '@/@types/common.type';
import { tImpactMethod } from '@/@types/impactMethod.type';
import { IMPACT_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

class ImpactAssessmentMethodApi {
	public getListImpactMethod() {
		return httpService.get<tCommonResponse<tImpactMethod[]>>(IMPACT_ENDPOINT.GET_LIST_IMPACT_METHOD);
	}

	public getImpactCategoriesByImpactMethodID() {}
}

export default ImpactAssessmentMethodApi;
