import { ImpactCategory } from '@/@types/impactCategory.type';
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

interface Impact {
	id: string;
	value: number;
	method: Omit<ImpactMethod, 'description'>;
	impactCategory: Omit<ImpactCategory, 'indicator' | 'indicatorDescription' | 'unit' | 'emissionCompartment'>;
}

interface Project<IData = unknown, PData = unknown, CData = unknown> {
	id: string;
	name: string;
	description: string;
	location: string;
	method: Omit<ImpactMethod, 'reference'>;
	impacts: IData;
	processes: PData;
	connectors: CData;
}

type GetProject = Omit<Project<Impact[]>, 'processes' | 'connectors'> & {
	value: number;
};

type CreateProjectResponse = {
	projectId: string;
};

type UpdateProjectResponse = Omit<Project, 'processes' | 'connectors' | 'impacts'> & {
	modifiedAt: string;
};

type GetProjectListResponse = Omit<Project<Impact[]>, 'processes' | 'connectors'> & {
	modifiedAt: string;
	owner: Owner;
	workspace: Workspace;
};

export type { CreateProjectResponse, GetProject, GetProjectListResponse, Owner, Project, UpdateProjectResponse, Workspace, Impact };
