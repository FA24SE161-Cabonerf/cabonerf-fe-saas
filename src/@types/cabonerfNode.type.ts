import { LifeCycleStages } from '@/@types/lifeCycleStages.type';
import { Node } from '@xyflow/react';

type CabonerfNode = Node<CabonerfNodeData, string>;

interface CabonerfNodeData {
	name: string;
	projectId: string;
	color: string;
	lifeCycleStage: LifeCycleStages;
	impacts: [];
	exchanges: [];
	[key: string]: unknown;
}

export type { CabonerfNode, CabonerfNodeData };
