import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CreateConnectorRes } from '@/@types/connector.type';
import { eDispatchType, PlaygroundDispatch, SheetBarDispatch } from '@/@types/dispatch.type';
import ProjectApis from '@/apis/project.apis';
import { DevTools } from '@/components/devtools';
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
	Background,
	BackgroundVariant,
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

import React, { MouseEvent, useCallback, useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

// const customEdge: EdgeTypes = {
// 	process: ProcessEdge,
// };

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

export default function Playground() {
	const { deleteElements, setViewport, setNodes: setMoreNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<CabonerfNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
	const { playgroundDispatch } = useContext(PlaygroundContext);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const { app, dispatch: appDispatch } = useContext(AppContext);
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
			setEdges(projectData.data.data.connectors);
			setNodes(projectData.data.data.processes);
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_METHOD, payload: projectData.data.data.method.id });
		}
	}, [
		playgroundDispatch,
		projectData?.data.data.method.id,
		projectData?.data.data.processes,
		projectData?.data.data.connectors,
		setEdges,
		setNodes,
	]);

	useLayoutEffect(() => {
		socket.auth = { user_id: app.userProfile?.id };
		socket.connect();

		socket.on('gateway:error-create-edge', (data) => {
			toast.error(data.message);
		});

		socket.on('gateway:delete-process-success', (data) => {
			deleteElements({ nodes: [{ id: data }] });
			appDispatch({ type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS, payload: data });
		});

		socket.on('gateway:connector-created', (data: CreateConnectorRes) => {
			const sanitizedData = _.omitBy<CreateConnectorRes>(data, isNull);

			console.log(data);

			if (sanitizedData.updatedProcess) {
				setNodes((nodes) =>
					nodes.map((item) => {
						if (item.id === sanitizedData.updatedProcess?.processId) {
							return {
								...item,
								data: {
									...item.data,
									exchanges: [...item.data.exchanges, sanitizedData.updatedProcess.exchange],
								},
							};
						}
						return item;
					})
				);
			}

			// Đợi cập nhật node hoàn tất, sau đó thêm edge
			requestAnimationFrame(() => {
				setEdges((eds) =>
					addEdge(
						{
							id: sanitizedData.connector?.id as string,
							source: sanitizedData.connector?.startProcessId as string,
							target: sanitizedData.connector?.endProcessId as string,
							sourceHandle: sanitizedData.connector?.startExchangesId,
							targetHandle: sanitizedData.connector?.endExchangesId,
						},
						eds
					)
				);
			});
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
				draggable: sheetState.process === undefined ? true : false,
			}))
		);
	}, [sheetState.process, setViewport, setMoreNodes]);

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
		(param: Connection) => {
			console.log(param);

			const value = _.omitBy(
				{
					projectId: params.pid,
					startProcessId: param.source,
					endProcessId: param.target,
					startExchangesId: param.sourceHandle,
					endExchangesId: param.targetHandle,
				},
				isNull
			);

			socket.emit('gateway:connector-create', value);
		},
		[params.pid]
	);

	const canPaneScrollAndDrag = useMemo(() => sheetState.process === undefined, [sheetState.process]);

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
					<Background bgColor="#f2f0eb" variant={BackgroundVariant.Dots} color="#86858f" />
					<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
					<PlaygroundToolBoxV2 />
					<Panel position="top-left">
						<PlaygroundActionToolbar />
					</Panel>
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
