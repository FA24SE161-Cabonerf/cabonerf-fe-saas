import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { BaseEdge, Edge, EdgeProps, getSimpleBezierPath } from '@xyflow/react';

type CustomEdge = Edge<CabonerfEdgeData, 'process'>;

export default function ProcessEdge(data: EdgeProps<CustomEdge>) {
	console.log(data.style);

	const [path] = getSimpleBezierPath({
		sourceX: data.sourceX,
		sourceY: data.sourceY,
		sourcePosition: data.sourcePosition,
		targetX: data.targetX,
		targetY: data.targetY,
		targetPosition: data.targetPosition,
	});

	return <BaseEdge path={path} {...data} style={data.style} />;
}
