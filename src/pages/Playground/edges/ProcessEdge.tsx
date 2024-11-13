import { BaseEdge, Edge, EdgeProps, getSimpleBezierPath } from '@xyflow/react';

type CustomEdge = Edge<{ value: number }, 'process'>;

export default function ProcessEdge(data: EdgeProps<CustomEdge>) {
	console.log(data);

	const [path, labelX, labelY, offsetX, offsetY] = getSimpleBezierPath({
		sourceX: data.sourceX,
		sourceY: data.sourceY,
		sourcePosition: data.sourcePosition,
		targetX: data.targetX,
		targetY: data.targetY,
		targetPosition: data.targetPosition,
	});

	return (
		<>
			<BaseEdge className="opacity-85" id={data.id} path={path} />
		</>
	);
}
