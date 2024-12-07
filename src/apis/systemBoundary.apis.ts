import { CommonResponse } from '@/@types/common.type';
import { SystemBoundary } from '@/@types/systemBoundary.type';
import httpService from '@/services/http';

export default class SystemBoundaryApis {
	public getAllSystemBoundary() {
		return httpService.get<CommonResponse<SystemBoundary[]>>(`/system-boundary`);
	}
}
