import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { eDispatchType, PlaygroundDispatch, SheetBarDispatch } from '@/@types/dispatch.type';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import ProjectApis from '@/apis/project.apis';
import { DevTools } from '@/components/devtools';
import { AppContext } from '@/contexts/app.context';
import LoadingProject from '@/pages/Playground/components/LoadingProject';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import SheetbarSide from '@/pages/Playground/components/SheetbarSide';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import ProcessNode from '@/pages/Playground/customs/ProcessNode';
import socket from '@/socket.io';
import { useQuery } from '@tanstack/react-query';
import { Background, BackgroundVariant, MiniMap, Node, NodeTypes, Panel, ReactFlow, useNodesState, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import React, { useCallback, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const customNode: NodeTypes = {
	process: ProcessNode,
};

export default function Playground() {
	const { playgroundDispatch } = useContext(PlaygroundContext);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const { app, dispatch: appDispatch } = useContext(AppContext);
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<CabonerfNodeData>>([]);
	const { deleteElements, setViewport, setNodes: setMoreNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const params = useParams<{ pid: string; wid: string }>();

	const { data: projectData, isFetching } = useQuery({
		queryKey: ['projects', { pid: params.pid, wid: params.wid }],
		queryFn: () => ProjectApis.prototype.getProjectById({ pid: params.pid as string, wid: params.wid as string }),
		enabled: Boolean(params.pid) && Boolean(params.wid),
	});

	useQuery({
		queryKey: ['impact_categories', projectData?.data.data.method.id],
		queryFn: () => ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: projectData?.data.data.method.id as string }),
		enabled: projectData?.data.data.method.id !== undefined,
		staleTime: 60 * 1000 * 10,
	});

	useEffect(() => {
		if (projectData?.data.data.processes) {
			setNodes(projectData.data.data.processes as Node<CabonerfNodeData>[]);
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_METHOD, payload: projectData.data.data.method });
		}
	}, [projectData, setNodes, playgroundDispatch]);

	useEffect(() => {
		socket.auth = { user_id: app.userProfile?.id };
		socket.connect();

		socket.on('gateway:delete-process-success', (data) => {
			deleteElements({ nodes: [{ id: data }] });
			appDispatch({ type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS, payload: data });
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id, deleteElements, appDispatch]);

	useEffect(() => {
		setMoreNodes((nodes) => {
			const shouldHide = Boolean(sheetState.process?.id);
			return nodes.map((item) => ({
				...item,
				hidden: shouldHide ? item.id !== sheetState.process?.id : false,
			}));
		});
	}, [sheetState.process?.id, setViewport, setMoreNodes]);

	const handlePaneClick = useCallback(() => {
		sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });

		setViewport({ x: 0, y: 0, zoom: 0.7 }, { duration: 800 });
	}, [sheetDispatch, setViewport]);

	const handleNodeDragStop = useCallback((event: any, node: Node<CabonerfNodeData>, nodes: Node<CabonerfNodeData>[]) => {
		const data: { id: string; x: number; y: number } = { id: node.id, x: node.position.x, y: node.position.y };

		socket.emit('gateway:node-update-position', data);
	}, []);

	if (isFetching) return <LoadingProject />;

	return (
		<React.Fragment>
			<PlaygroundHeader />
			<div className="relative h-[calc(100vh-50px)]">
				<ReactFlow
					defaultViewport={{ zoom: 0.7, x: 0, y: 0 }}
					className="relative"
					nodeTypes={customNode}
					nodes={nodes}
					deleteKeyCode=""
					onPaneClick={handlePaneClick}
					onNodesChange={onNodesChange}
					onNodeDragStop={handleNodeDragStop}
				>
					<Background variant={BackgroundVariant.Lines} size={1.5} bgColor="#fafafa" color="#f4f4f5" />
					<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
					<PlaygroundToolBoxV2 />
					<Panel position="bottom-center">
						<PlaygroundControls />
					</Panel>
					<DevTools />
				</ReactFlow>
				{sheetState.process && <SheetbarSide />}
			</div>
		</React.Fragment>
	);
}
