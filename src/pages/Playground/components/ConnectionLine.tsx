import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { Node, useConnection } from '@xyflow/react';

export default function ConnectionLine({ fromX, fromY, toX, toY }) {
	const connection = useConnection<Node<CabonerfNodeData>>();

	return (
		<g>
			<path
				fill="none"
				stroke={connection.fromNode?.data.color}
				strokeWidth={2}
				className="animated"
				d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
			/>
			<circle cx={toX} cy={toY} fill="#fff" r={5} stroke={connection.fromNode?.data.color} strokeWidth={1.5} />
		</g>
	);
}
