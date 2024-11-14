import { LifeCycleStages } from '@/@types/lifeCycleStage.type';

interface UpdateProcessRes {
	id: string;
	name: string;
	description: string;
	lifeCycleStage: LifeCycleStages;
}

export type { UpdateProcessRes };
