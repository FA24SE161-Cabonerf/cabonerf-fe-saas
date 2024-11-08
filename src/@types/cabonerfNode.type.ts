import { LifeCycleStages } from '@/@types/lifeCycleStage.type';
import { Node } from '@xyflow/react';

type CabonerfNode = Node<CabonerfNodeData>;

interface CabonerfNodeData {
	name: string;
	description: string;
	projectId: string;
	color: string;
	lifeCycleStage: LifeCycleStages;
	overallProductFlowRequired: number;
	impacts: [];
	exchanges: [];
	[key: string]: unknown;
}

export type { CabonerfNodeData, CabonerfNode };
