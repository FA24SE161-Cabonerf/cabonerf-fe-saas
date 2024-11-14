import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { Connector, CreateConnectorRes } from '@/@types/connector.type';
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
import ProcessNode from '@/pages/Playground/nodes/ProcessNode';
import TextNode from '@/pages/Playground/nodes/TextNode';
import socket from '@/socket.io';
import { useQuery } from '@tanstack/react-query';

import {
	addEdge,
	Connection,
	Edge,
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
import _, { isNull } from 'lodash';

import React, { MouseEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// const customEdge: EdgeTypes = {
// 	process: ProcessEdge,
// };

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

export default function Playground() {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<CabonerfNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
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

		socket.on('gateway:connector-created', (data: CreateConnectorRes) => {
			const sanitizeData = _.omitBy<CreateConnectorRes>(data, isNull);

			console.log(sanitizeData);

			if (sanitizeData.updatedProcess) {
				setNodes((nodes) =>
					nodes.map((item) => {
						if (item.id === sanitizeData.updatedProcess?.processId) {
							const newNode: Node<CabonerfNodeData> = {
								...item,
								data: {
									...item.data,
									exchanges: [...item.data.exchanges, sanitizeData.updatedProcess.exchange],
								},
							};
							return newNode;
						}
						return item;
					})
				);
			}

			setEdges((eds) =>
				addEdge(
					{
						id: sanitizeData.connector?.id as string,
						source: sanitizeData.connector?.startProcessId as string,
						target: sanitizeData.connector?.endProcessId as string,
						sourceHandle: sanitizeData.connector?.startExchangesId,
						targetHandle: sanitizeData.connector?.endExchangesId,
					},
					eds
				)
			);
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id, appDispatch, deleteElements, setEdges, setNodes]);

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

	const onConnect = useCallback((params: Connection) => {
		const value = _.omitBy(
			{
				startProcessId: params.source,
				endProcessId: params.target,
				startExchangesId: params.sourceHandle,
				endExchangesId: params.targetHandle,
			},
			isNull
		);

		socket.emit('gateway:connector-create', value);
	}, []);

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
