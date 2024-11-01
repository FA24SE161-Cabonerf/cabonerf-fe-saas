import { AppContext } from '@/contexts/app.context';
import BackButton from '@/pages/Playground/components/BackButton';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import ProcessNode from '@/pages/Playground/customs/ProcessNode';
import socket from '@/socket.io';
import { applyNodeChanges, Background, BackgroundVariant, MiniMap, Node, NodeChange, NodeTypes, Panel, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { debounce } from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const customNode: NodeTypes = {
	process: ProcessNode,
};

const nds: Node[] = [];

const debouncedLog = debounce((id: string, x, y) => {
	console.log(`id:${id}, x: ${x}, y: ${y}`);
}, 200);

export default function Playground() {
	const { app: contextApp } = useContext(contextMenu);
	const { app } = useContext(AppContext);
	const [nodes, setNodes] = useState<Node[]>(nds);

	useEffect(() => {
		socket.auth = {
			user_id: app.userProfile?.id,
		};

		socket.connect();

		socket.on('node:created', (arg) => {
			console.log(arg);
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id]);

	useEffect(() => {
		console.log({
			processID: contextApp.contextMenuSelector?.id,
			mouseX: contextApp.contextMenuSelector?.clientX,
			mouseY: contextApp.contextMenuSelector?.clientY,
		});
	}, [contextApp.contextMenuSelector]);

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
					<Background variant={BackgroundVariant.Dots} size={1.5} color="#dedede" />
					<MiniMap className="" offsetScale={2} pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />

					<Panel position="top-left">
						<BackButton />
					</Panel>
					<PlaygroundToolBoxV2 />

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
