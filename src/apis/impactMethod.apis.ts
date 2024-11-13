import { CommonResponse } from '@/@types/common.type';
import { ImpactMethod } from '@/@types/impactMethod.type';
import { IMPACT_METHOD_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http.tsx';

class ImpactMethodApis {
	public getImpactMethods() {
		return httpService.get<CommonResponse<ImpactMethod[]>>(IMPACT_METHOD_ENDPOINT.GET_IMPACT_METHODS);
	}
}

export default ImpactMethodApis;
