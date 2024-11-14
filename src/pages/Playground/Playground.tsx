import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { eDispatchType, PlaygroundDispatch, SheetBarDispatch } from '@/@types/dispatch.type';
import ProjectApis from '@/apis/project.apis';
import { AppContext } from '@/contexts/app.context';
import LoadingProject from '@/pages/Playground/components/LoadingProject';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import SheetbarSide from '@/pages/Playground/components/SheetbarSide';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import ProcessEdge from '@/pages/Playground/edges/ProcessEdge';
import ProcessNode from '@/pages/Playground/nodes/ProcessNode';
import TextNode from '@/pages/Playground/nodes/TextNode';
import socket from '@/socket.io';
import { useQuery } from '@tanstack/react-query';

import {
	addEdge,
	Connection,
	Edge,
	EdgeTypes,
	MiniMap,
	Node,
	NodeTypes,
	Panel,
	ReactFlow,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import React, { MouseEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const customEdge: EdgeTypes = {
	process: ProcessEdge,
};

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

const initEdges: Edge[] = [
	{
		source: '4ee033d2-4744-472c-a5b6-1f3b93a0eda6',
		sourceHandle: 'source1',
		target: 'aa866a63-c19f-4d3a-82a1-48ecf8171538',
		targetHandle: 'target1',
		type: 'process',
		data: {
			value: 'minh',
		},
		id: 'xy-edge__4ee033d2-4744-472c-a5b6-1f3b93a0eda6source1-aa866a63-c19f-4d3a-82a1-48ecf8171538target1',
		style: {
			strokeWidth: 50,
			strokeOpacity: 90,
		},
	},
];

export default function Playground() {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<CabonerfNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initEdges);
	const { playgroundDispatch } = useContext(PlaygroundContext);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const { app, dispatch: appDispatch } = useContext(AppContext);
	const { deleteElements, setViewport, setNodes: setMoreNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const params = useParams<{ pid: string; wid: string }>();

	const { data: projectData, isFetching } = useQuery({
		queryKey: ['projects', { pid: params.pid, wid: params.wid }],
		queryFn: () => ProjectApis.prototype.getProjectById({ pid: params.pid as string, wid: params.wid as string }),
		enabled: Boolean(params.pid) && Boolean(params.wid),
		staleTime: 0,
		refetchOnMount: true,
	});

	useEffect(() => {
		if (projectData?.data.data.processes) {
			setNodes(projectData.data.data.processes as Node<CabonerfNodeData>[]);
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_METHOD, payload: projectData.data.data.method.id });
		}
	}, [playgroundDispatch, projectData?.data.data.method.id, projectData?.data.data.processes, setNodes]);

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
		setMoreNodes((nodes) =>
			nodes.map((item) => ({
				...item,
				hidden: sheetState.process?.id ? item.id !== sheetState.process.id : false,
			}))
		);
	}, [sheetState.process?.id, setViewport, setMoreNodes]);

	useEffect(() => {
		// Cập nhật thuộc tính draggable của các nodes dựa trên sheetState
		setMoreNodes((prevNodes) =>
			prevNodes.map((node) => ({
				...node,
				draggable: sheetState.process === undefined ? true : false, // Điều chỉnh theo sheetState
			}))
		);
	}, [sheetState.process, setMoreNodes]);

	const handleNodeDragStop = useCallback((_event: MouseEvent, node: Node<CabonerfNodeData>) => {
		socket.emit('gateway:node-update-position', { id: node.id, x: node.position.x, y: node.position.y });
	}, []);

	const handlePanelClick = useCallback(() => {
		if (sheetState.process) {
			sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
			setViewport({ x: 0, y: 0, zoom: 0.7 }, { duration: 800 });
		}
	}, [setViewport, sheetDispatch, sheetState]);

	const onConnect = useCallback(
		(params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'process', data: { value: 'minh' } }, eds)),
		[setEdges]
	);

	const canPaneScrollAndDrag = useMemo(() => sheetState.process === undefined, [sheetState.process]);

	if (isFetching) return <LoadingProject />;

	return (
		<React.Fragment>
			<PlaygroundHeader />
			<div className="relative h-[calc(100vh-50px)]">
				<ReactFlow
					defaultViewport={{ zoom: 0.7, x: 0, y: 0 }}
					className="relative bg-[#f0f0f0]"
					nodeTypes={customNode}
					edgeTypes={customEdge}
					nodes={nodes}
					edges={edges}
					panOnDrag={canPaneScrollAndDrag}
					zoomOnDoubleClick={false}
					preventScrolling={canPaneScrollAndDrag}
					onConnect={onConnect}
					onPaneClick={handlePanelClick}
					proOptions={{ hideAttribution: true }}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onlyRenderVisibleElements
					onNodeDragStop={handleNodeDragStop}
				>
					{/* <Background /> */}
					<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
					<PlaygroundToolBoxV2 />
					<Panel position="top-left">
						<PlaygroundActionToolbar />
					</Panel>
					<Panel position="bottom-center">
						<PlaygroundControls />
					</Panel>
				</ReactFlow>
				{sheetState.process && <SheetbarSide />}
			</div>
		</React.Fragment>
	);
}
