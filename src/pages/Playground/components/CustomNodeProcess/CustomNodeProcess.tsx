import { Node, NodeProps } from '@xyflow/react';

type CustomNodeProcessNode = Node<{ name: string }, 'custom'>;

export default function CustomNodeProcess({ data }: NodeProps<CustomNodeProcessNode>) {
	return <div>Data: {data.name}</div>;
}
