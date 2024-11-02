import { LifeCycleStages } from '@/@types/lifeCycleStages.type';
import { Node } from '@xyflow/react';

type CabonerfNode = Node<CabonerfNodeData, string>;

interface CabonerfNodeData {
	projectId: string;
	color: string;
	lifeCycleStages: LifeCycleStages;
	name: string;
	[key: string]: unknown;
}

export type { CabonerfNode, CabonerfNodeData };
