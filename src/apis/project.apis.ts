import { CommonResponse } from '@/@types/common.type';
import { CreateProjectResponse, GetProjectListResponse, Impact, Project } from '@/@types/project.type';
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
				projects: GetProjectListResponse[];
			}>
		>(PROJECT_ENDPOINT.PROJECT);
	}

	public async getProjectById(payload: { pid: string; wid: string }) {
		return httpService.get<CommonResponse<Project<Impact>>>(`${PROJECT_ENDPOINT.PROJECT}/${payload.pid}/${payload.wid}`);
	}

	public async createProject(payload: CreateProjectSchema) {
		return httpService.post<CommonResponse<CreateProjectResponse>>(PROJECT_ENDPOINT.CREATE_NEW_PROJECT, payload);
	}

	public async deleteProject(payload: { id: string }) {
		return httpService.delete<CommonResponse<[]>>(`${PROJECT_ENDPOINT.PROJECT}/${payload.id}`);
	}
}

export default ProjectApis;
