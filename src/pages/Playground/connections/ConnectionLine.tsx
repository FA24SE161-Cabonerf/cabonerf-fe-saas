import { useConnection } from '@xyflow/react';

interface Props {
	fromX: number;
	fromY: number;
	toX: number;
	toY: number;
}

export default function ConnectionLine({ fromX, fromY, toX, toY }: Props) {
	const { fromHandle } = useConnection();

	return (
		<g>
			<path
				fill="#fff"
				stroke={fromHandle?.id as string}
				strokeWidth={1.5}
				className="animated"
				d={`M${fromX},${fromY} C ${fromX} ${toY} ${fromX} ${toY} ${toX},${toY}`}
			/>
			<circle cx={toX} cy={toY} fill="#fff" r={3} stroke={fromHandle?.id as string} strokeWidth={1.5} />
		</g>
	);
}
