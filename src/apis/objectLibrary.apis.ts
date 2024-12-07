import { CommonResponse } from '@/@types/common.type';
import { ObjectLibrary } from '@/@types/objectLibrary.type';
import { OBJECT_LIBRARY } from '@/constants/api.endpoint';
import httpService from '@/services/http';
import _ from 'lodash';

interface QueryParams {
	organizationId: string;
	pageCurrent: number;
	pageSize?: number;
	keyword?: string;
	systemBoundaryId?: string;
}

export default class ObjectLibraryApis {
	public createObjectLibrary(payload: { projectId: string }) {
		return httpService.post<CommonResponse<string>>(`${OBJECT_LIBRARY.OBJECT_LIBRARY}/${payload.projectId}`);
	}

	public async getListObjectLibrary(_queryParams: QueryParams) {
		const data = await httpService.get<
			CommonResponse<{ pageCurrent: number; totalPage: number; pageSize: number; objectLibraryList: ObjectLibrary[] }>
		>(`${OBJECT_LIBRARY.OBJECT_LIBRARY}/organizations/${_queryParams.organizationId}`, {
			params: _.omit(_queryParams, ['organizationId']),
		});

		return data.data.data;
	}
}
