import { Handle, Node, NodeProps, Position } from '@xyflow/react';

type ProcessNodeProps = Node<{ label: string; color: string }, 'process'>;

export default function Process(data: NodeProps<ProcessNodeProps>) {
	return (
		<>
			<div style={{ padding: '10px 20px' }}>{data.data.label}</div>

			<Handle id="2" type="target" position={Position.Left} />
			<Handle id="3" className="mt-10" type="target" position={Position.Left} />

			<Handle type="source" position={Position.Right} />
		</>
	);
}
