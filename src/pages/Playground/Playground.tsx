/* eslint-disable @typescript-eslint/no-unused-vars */
import { ContextDispatch, eDispatchType } from '@/@types/dispatch.type';
import { AppContext } from '@/contexts/app.context';
import BackButton from '@/pages/Playground/components/BackButton';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import ProcessNode from '@/pages/Playground/customs/ProcessNode';
import socket from '@/socket.io';
import {
	applyNodeChanges,
	Background,
	BackgroundVariant,
	MiniMap,
	Node,
	NodeChange,
	NodeTypes,
	Panel,
	ReactFlow,
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { MouseEvent, useCallback, useContext, useEffect, useState } from 'react';

const customNode: NodeTypes = {
	process: ProcessNode,
};

const nds: Node[] = [];

export default function Playground() {
	const { deleteElements } = useReactFlow();
	const { dispatch } = useContext(contextMenu);
	const { app, dispatch: appDispatch } = useContext(AppContext);
	const [nodes, setNodes] = useState<Node[]>(nds);

	useEffect(() => {
		socket.auth = {
			user_id: app.userProfile?.id,
		};

		socket.connect();

		socket.on('gateway:delete-process-success', (data) => {
			deleteElements({
				nodes: [{ id: data }],
			});

			appDispatch({
				type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS,
				payload: data,
			});
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id, deleteElements, appDispatch]);

	const handleNodeDragStop = useCallback((event: MouseEvent, node: Node, nodes: Node[]) => {}, []);

	const handleNodeChange = useCallback(
		(changes: NodeChange<Node>[]) => {
			setNodes((nds) => applyNodeChanges(changes, nds));

			// Close context menu
			dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });
		},
		[dispatch]
	);

	return (
		<React.Fragment>
			<div className="h-[100vh]">
				<ReactFlow
					nodeTypes={customNode}
					nodes={nodes}
					deleteKeyCode=""
					onNodeDragStop={handleNodeDragStop}
					onNodesChange={handleNodeChange}
				>
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
