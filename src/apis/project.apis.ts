import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CommonResponse } from '@/@types/common.type';
import { Contributor, CreateProjectResponse, GetProjectListResponse, Impact, Project } from '@/@types/project.type';
import { IMPACT_METHOD_ENDPOINT, PROJECT_ENDPOINT } from '@/constants/api.endpoint';
import { CreateProjectSchema } from '@/schemas/validation/project.schema';
import httpService from '@/services/http.tsx';
import { Edge, Node } from '@xyflow/react';

class ProjectApis {
	public async getAllProjects(payload: { organizationId: string }) {
		const result = await httpService.get<
			CommonResponse<{
				pageCurrent: string;
				pageSize: string;
				totalPage: string;
				projects: GetProjectListResponse[];
			}>
		>(PROJECT_ENDPOINT.PROJECT, {
			params: payload,
		});
		return result.data.data;
	}

	public async getProjectById(payload: { pid: string }) {
		const respone = await httpService.get<CommonResponse<Project<Impact[], Node<CabonerfNodeData>[], Edge<CabonerfEdgeData>[]>>>(
			`${PROJECT_ENDPOINT.PROJECT}/${payload.pid}`
		);
		return respone.data.data;
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

	public calculateProject(payload: { projectId: string }) {
		return httpService.post<CommonResponse<Project & { contributionBreakdown: Contributor }>>(
			`${PROJECT_ENDPOINT.PROJECT}${PROJECT_ENDPOINT.CALCULATE_PROJECT}`,
			payload
		);
	}

	public favoriteProject(payload: { projectId: string }) {
		return httpService.put<CommonResponse<Pick<Project, 'id' | 'description' | 'location' | 'name' | 'method' | 'favorite'>>>(
			`${PROJECT_ENDPOINT.PROJECT}/${payload.projectId}${PROJECT_ENDPOINT.FAVORITE}`
		);
	}

	public exportToExcel(payload: { projectId: string }) {
		return httpService.post<any>(`${PROJECT_ENDPOINT.PROJECT}${PROJECT_ENDPOINT.EXPORT}`, payload);
	}

	public compareProjects(payload: { firstProjectId: string; secondProjectId: string }) {
		return httpService.post<
			CommonResponse<{
				firstProjectId: string;
				firstProjectProcesses: CabonerfNodeData[];
				secondProjectId: string;
				secondProjectProcesses: CabonerfNodeData[];
			}>
		>(`${PROJECT_ENDPOINT.PROJECT}/comparisons`, payload);
	}
}

export default ProjectApis;
