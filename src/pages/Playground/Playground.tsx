import BackButton from '@/pages/Playground/components/BackButton';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import Process from '@/pages/Playground/customs/Process';
import {
	applyNodeChanges,
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	NodeChange,
	NodeTypes,
	Panel,
	Position,
	ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { debounce } from 'lodash';
import React, { useCallback, useState } from 'react';

const customNode: NodeTypes = {
	process: Process,
};

const nds: Node[] = [
	{
		id: '123',
		data: {
			name: '123',
			label: 'blue',
		},
		position: {
			x: 700,
			y: 450,
		},
		initialWidth: 200,
		initialHeight: 300,
		type: 'process',
		sourcePosition: Position.Right,
		selectable: true,
		draggable: true,
	},
];

const debouncedLog = debounce((id: string, x, y) => {
	console.log(`id:${id}, x: ${x}, y: ${y}`);
}, 200);

export default function Playground() {
	const [nodes, setNodes] = useState<Node[]>(nds);

	const onNodeChange = useCallback((changes: NodeChange<Node>[]) => {
		setNodes((nds) => applyNodeChanges(changes, nds));

		changes.forEach((change) => {
			if (change.type === 'position') {
				debouncedLog(change.id, change.position?.x, change.position?.y);
			}
		});
	}, []);

	return (
		<React.Fragment>
			<div className="relative h-[100vh]">
				<ReactFlow nodeTypes={customNode} nodes={nodes} onNodesChange={onNodeChange}>
					<Background variant={BackgroundVariant.Dots} size={1.5} color="#d4d4d4" />
					<MiniMap className="" offsetScale={2} pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
					<Panel position="top-left">
						<BackButton />
					</Panel>
					<PlaygroundToolBoxV2 />
					{/* <Panel>
						<PlaygroundToolBox />
					</Panel> */}
					<Panel position="bottom-center">
						<PlaygroundControls />
					</Panel>
					<Panel position="top-right">
						<PlaygroundActionToolbar />
					</Panel>
				</ReactFlow>
			</div>
		</React.Fragment>
	);
}
