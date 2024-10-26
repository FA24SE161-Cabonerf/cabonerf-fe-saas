import { ImpactMethod } from '@/@types/impactMethod.type';

interface Workspace {
	id: string;
	name: string;
}

interface Owner {
	id: string;
	name: string;
	email: string;
	profilePictureUrl: string;
}

interface Project {
	id: string;
	name: string;
	description: string;
	location: string;
	method: Omit<ImpactMethod, 'reference'>;
	impacts: unknown[];
	processes: unknown[];
	connectors: unknown[];
}

type CreateProjectResponse = {
	projectId: string;
};

type UpdateProjectResponse = Omit<Project, 'processes' | 'connectors' | 'impacts'> & {
	modifiedAt: string;
};

type GetProjectListResponse = Omit<Project, 'processes' | 'connectors'> & {
	modifiedAt: string;
	owner: Owner;
	workspace: Workspace;
};

export type { Project, CreateProjectResponse, GetProjectListResponse, UpdateProjectResponse };
