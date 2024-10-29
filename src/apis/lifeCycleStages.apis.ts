import { CommonResponse } from '@/@types/common.type';
import { LifeCycleStages } from '@/@types/lifeCycleStages.type';
import { LIFE_CYCLE_STAGES_ENDPOINT } from '@/constants/api.endpoint';
import httpService from '@/services/http';

class LifeCycleStagesApis {
	public getAllLifeCycleStages() {
		return httpService.get<CommonResponse<LifeCycleStages[]>>(LIFE_CYCLE_STAGES_ENDPOINT.LIFE_CYCLE_STAGES);
	}
}

export default LifeCycleStagesApis;
