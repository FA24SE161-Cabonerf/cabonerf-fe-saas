import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
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

interface Project<IData = Impact[], PData = CabonerfNodeData[], CData = unknown> {
	id: string;
	name: string;
	description: string;
	location: string;
	method: Omit<ImpactMethod, 'reference'>;
	impacts: IData;
	processes: PData;
	connectors: CData;
	favorite: boolean;
}

type TransformContributor = {
	processId: string;
	processEnd?: string;
	net?: number;
	total?: number;
	subProcesses: TransformContributor[];
};

type GetProject = Omit<Project<Impact[]>, 'processes' | 'connectors'> & {
	value: number;
};

type CreateProjectResponse = {
	projectId: string;
};

type Contributor = {
	processId: string;
	net: number;
	subProcesses: Contributor[];
};

type UpdateProjectResponse = Omit<Project, 'processes' | 'connectors' | 'impacts'> & {
	modifiedAt: string;
};

type GetProjectListResponse = Omit<Project<Impact[]>, 'processes' | 'connectors'> & {
	modifiedAt: string;
	owner: Owner;
	workspace: Workspace;
};

type Insensity = {
	id: string;
	category: string;
	value: number;
	unit: string;
	description: string;
	icon: string;
};

export type {
	Insensity,
	Contributor,
	CreateProjectResponse,
	GetProject,
	GetProjectListResponse,
	Impact,
	Owner,
	TransformContributor,
	Project,
	UpdateProjectResponse,
	Workspace,
};
