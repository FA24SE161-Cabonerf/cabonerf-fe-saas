import { CommonResponse } from '@/@types/common.type';
import { UpdateProcessRes } from '@/@types/process.type';
import { PROCESS } from '@/constants/api.endpoint';
import httpService from '@/services/http';

export default class ProcessApis {
	public async updateProcess(id: string, payload: { name: string; description: string; lifeCycleStagesId: string }) {
		return httpService.put<CommonResponse<UpdateProcessRes>>(`${PROCESS.PROCESS}/${id}`, payload);
	}
}
