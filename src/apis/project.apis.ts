import { CommonResponse } from '@/@types/common.type';
import { CreateProjectResponse, Project } from '@/@types/project.type';
import { PROJECT_ENDPOINT } from '@/constants/api.endpoint';
import { CreateProjectSchema } from '@/schemas/validation/project.schema';
import httpService from '@/services/http';

class ProjectApis {
	public async getAllProjects() {
		return httpService.get<
			CommonResponse<{
				pageCurrent: string;
				pageSize: string;
				totalPage: string;
				projects: Project[];
			}>
		>(PROJECT_ENDPOINT.PROJECT);
	}
	public async createProject(payload: CreateProjectSchema) {
		return httpService.post<CommonResponse<CreateProjectResponse>>(PROJECT_ENDPOINT.CREATE_NEW_PROJECT, payload);
	}
}

export default ProjectApis;
