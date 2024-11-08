import { Exchange } from '@/@types/exchange.type';
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
	exchanges: Exchange[];
	[key: string]: unknown;
}

export type { CabonerfNodeData, CabonerfNode };
