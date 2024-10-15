import { tCommonResponse } from '@/@types/common.type';
import { tImpactAssessmentMethod } from '@/@types/impact.type';
import { IMPACT_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

class ImpactAssessmentMethodApi {
	getListImpactAssessmentMethod() {
		return httpService.get<tCommonResponse<tImpactAssessmentMethod[]>>(
			IMPACT_ENDPOINT.GET_ALL_IMPACT_ASSESSMENT_METHOD
		);
	}
}

export default ImpactAssessmentMethodApi;
