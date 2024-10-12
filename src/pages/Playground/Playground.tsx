import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundToolBox from '@/pages/Playground/components/PlaygroundToolBox/PlaygroundToolBox';
import { Background, BackgroundVariant, MiniMap, Node, Panel, ReactFlow, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React from 'react';

const nds: Node[] = [
	{
		id: '1',
		data: {},
		position: {
			x: 100,
			y: 200,
		},
	},
	{
		id: '2',
		data: {},
		position: {
			x: 200,
			y: 200,
		},
	},
];

export default function Playground() {
	const [nodes, , onNodesChange] = useNodesState(nds);

	return (
		<React.Fragment>
			<PlaygroundHeader />
			<div className="relative h-[calc(100vh-57px)]">
				<ReactFlow nodes={nodes} onNodesChange={onNodesChange}>
					<Background variant={BackgroundVariant.Dots} size={1.5} color="#d4d4d4" />
					<MiniMap pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
					<Panel position="top-left" className="m-0">
						<PlaygroundToolBox />
					</Panel>
					<Panel position="bottom-left">
						<PlaygroundControls />
					</Panel>
				</ReactFlow>
			</div>
		</React.Fragment>
	);
}
