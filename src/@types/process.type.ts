import { ImpactProcess } from '@/@types/impactProcess.type';
import { LifeCycleStages } from '@/@types/lifeCycleStages.type';

interface Process {
	id: string;
	name: string;
	decsription: string;
	lifeCycleStages: LifeCycleStages;
	impacts: ImpactProcess;
	exchanges: [];
}
