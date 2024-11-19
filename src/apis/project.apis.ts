import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CommonResponse } from '@/@types/common.type';
import { CreateProjectResponse, GetProjectListResponse, Impact, Project } from '@/@types/project.type';
import { IMPACT_METHOD_ENDPOINT, PROJECT_ENDPOINT } from '@/constants/api.endpoint';
import { CreateProjectSchema } from '@/schemas/validation/project.schema';
import httpService from '@/services/http.tsx';
import { Edge, Node } from '@xyflow/react';

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
		return httpService.get<CommonResponse<Project<Impact, Node<CabonerfNodeData>[], Edge<CabonerfEdgeData>[]>>>(
			`${PROJECT_ENDPOINT.PROJECT}/${payload.pid}/${payload.wid}`
		);
	}

	public async updateImpactMethodProject(payload: { pid: string; mid: string }) {
		return httpService.patch<CommonResponse<Project<Impact>>>(
			`${PROJECT_ENDPOINT.PROJECT}/${payload.pid}${IMPACT_METHOD_ENDPOINT.IMPACT_METHODS}/${payload.mid}`
		);
	}

	public async createProject(payload: CreateProjectSchema) {
		return httpService.post<CommonResponse<CreateProjectResponse>>(PROJECT_ENDPOINT.CREATE_NEW_PROJECT, payload);
	}

	public async deleteProject(payload: { id: string }) {
		return httpService.delete<CommonResponse<[]>>(`${PROJECT_ENDPOINT.PROJECT}/${payload.id}`);
	}

	public async updateProject(id: string, payload: { name: string; description: string; location: string }) {
		return httpService.put<CommonResponse<Pick<Project, 'id' | 'description' | 'location' | 'name' | 'method'>>>(
			`${PROJECT_ENDPOINT.UPDATE_PROJECT}/${id}`,
			payload
		);
	}
}

export default ProjectApis;
