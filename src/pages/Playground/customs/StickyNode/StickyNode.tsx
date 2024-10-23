import { Node, NodeProps } from '@xyflow/react';
import { Paperclip } from 'lucide-react';

type StickyNodeProps = Node<{ name: string; color: string }, 'sticky-node'>;

export default function StickyNode({ data }: NodeProps<StickyNodeProps>) {
	return (
		<div className="rounded border p-10" style={{ backgroundColor: data.color }}>
			<div className="text-xl text-white">{data.name}</div>
		</div>
	);
}
