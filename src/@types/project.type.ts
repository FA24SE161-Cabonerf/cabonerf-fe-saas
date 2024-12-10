import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { ImpactMethod } from '@/@types/impactMethod.type';
import { LifeCycleStages } from '@/@types/lifeCycleStage.type';
import { IndustryCode } from '@/@types/organization.type';

interface Workspace {
	id: string;
	name: string;
}

interface Owner {
	id: string;
	fullName: string;
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
	lifeCycleStageBreakdown?: LifeCycleStageBreakdown[];
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
	intensity: Insensity[];
	functionalUnit: string;
	industryCode: IndustryCode;
};

type Insensity = {
	id: string;
	category: string;
	value: number;
	unit: string;
	description: string;
	icon: string;
	ref: string;
	ref_description: string;
};

type LifeCycleStageBreakdown = {
	id: string;
	name: string;
	lifeCycleStage: (Pick<LifeCycleStages, 'name' | 'id' | 'iconUrl'> & { percent: number })[];
};

export type {
	LifeCycleStageBreakdown,
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
