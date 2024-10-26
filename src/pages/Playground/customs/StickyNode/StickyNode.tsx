import { Node, NodeProps } from '@xyflow/react';

type StickyNodeProps = Node<{ name: string; color: string }, 'sticky-node'>;

export default function StickyNode(data: NodeProps<StickyNodeProps>) {
	return (
		<div className="rounded border p-10" style={{ backgroundColor: data.data.name }}>
			<div className="text-xl text-white">{data.data.name}</div>
			<div>{data.selected ? 'Selected' : ''}</div>
		</div>
	);
}
