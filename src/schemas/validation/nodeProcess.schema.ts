import { LifeCycleStages } from '@/@types/lifeCycleStages.type';

interface CreateCabonerfNodeReqBody {
	id: string;
	projectId: string;
	color: string;
	lifeCycleStages: LifeCycleStages;
	type: string;
	[key: string]: unknown;
}

export type { CreateCabonerfNodeReqBody };
