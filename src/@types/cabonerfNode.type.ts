import { Exchange } from '@/@types/exchange.type';
import { LifeCycleStages } from '@/@types/lifeCycleStage.type';
import { Impact } from '@/@types/project.type';
import { Node } from '@xyflow/react';

type CabonerfNode = Node<CabonerfNodeData>;

interface CabonerfNodeData {
	id: string;
	name: string;
	description: string;
	projectId: string;
	color: string;
	bgColor: string;
	library: boolean;
	lifeCycleStage: LifeCycleStages;
	overallProductFlowRequired: number;
	impacts: Omit<Impact & { unitLevel: number; systemLevel: number; overallImpactContribution: number }, 'value'>[];
	exchanges: Exchange[];
	[key: string]: unknown;
}

export type { CabonerfNodeData, CabonerfNode };
