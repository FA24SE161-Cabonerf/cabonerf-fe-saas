import { Exchange } from '@/@types/exchange.type';
import { LifeCycleStages } from '@/@types/lifeCycleStage.type';
import { Impact } from '@/@types/project.type';

type SystemBoundary = {
	boundaryFrom: string;
	boundaryTo: string;
	description: string;
};

type ObjectLibrary = {
	id: string;
	name: string;
	description: string;
	library: boolean;
	systemBoundary: SystemBoundary;
	lifeCycleStage: LifeCycleStages;
	impacts: Omit<Impact & { unitLevel: number; systemLevel: number; overallImpactContribution: number }, 'value'>[];
	exchanges: Exchange[];
};
