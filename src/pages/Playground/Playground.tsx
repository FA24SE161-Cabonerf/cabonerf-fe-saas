import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CreateConnectorRes } from '@/@types/connector.type';
import { eDispatchType, PlaygroundDispatch, SheetBarDispatch } from '@/@types/dispatch.type';
import ProjectApis from '@/apis/project.apis';
import { AppContext } from '@/contexts/app.context';
import LoadingProject from '@/pages/Playground/components/LoadingProject';
import PlaygroundActionToolbar from '@/pages/Playground/components/PlaygroundActionToolbar';
import PlaygroundControls from '@/pages/Playground/components/PlaygroundControls';
import PlaygroundToolBoxV2 from '@/pages/Playground/components/PlaygroundToolBoxV2';
import SheetbarSide from '@/pages/Playground/components/SheetbarSide';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import ProcessNode from '@/pages/Playground/nodes/ProcessNode';
import TextNode from '@/pages/Playground/nodes/TextNode';
import socket from '@/socket.io';
import { useQuery } from '@tanstack/react-query';

import {
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
	useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import React, { MouseEvent, useCallback, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import ConnectionLine from '@/pages/Playground/components/ConnectionLine';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import ProcessEdge from '@/pages/Playground/edges/ProcessEdge';
import { isNull, omitBy } from 'lodash';
import { flushSync } from 'react-dom';
import { Impact } from '@/@types/project.type';
import PlaygroundControlContextProvider from '@/pages/Playground/contexts/playground-control.context';

const customEdge: EdgeTypes = {
	process: ProcessEdge,
};

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

export default function Playground() {
	const { deleteElements, setViewport, addEdges, setNodes: setMoreNodes, setEdges: setMoreEdges } = useReactFlow<Node<CabonerfNodeData>>();
	const [nodes, setNodes, onNodesChange] = useNodesState<Node<CabonerfNodeData>>([]);
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

	const updateNodeInternal = useUpdateNodeInternals();

	const { playgroundState, playgroundDispatch } = useContext(PlaygroundContext);
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

	const project = projectData?.data.data;

	useEffect(() => {
		const projectName = playgroundState.projectInformation?.name ?? 'Loading...';

		document.title = `${projectName} — Cabonerf`;
	}, [playgroundState.projectInformation?.name]);

	useEffect(() => {
		if (project?.processes) {
			setEdges(project.connectors);
			setNodes(project.processes);
			playgroundDispatch({
				type: PlaygroundDispatch.SET_PROJECT_INFOR,
				payload: {
					name: project.name,
					description: project.description,
					location: project.location,
				},
			});
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_METHOD, payload: project.method.id });
		}
	}, [
		playgroundDispatch,
		project?.method.id,
		project?.processes,
		project?.connectors,
		setEdges,
		setNodes,
		project?.name,
		project?.description,
		project?.location,
	]);

	useEffect(() => {
		socket.connect();

		socket.on('gateway:error-create-edge', (data) => {
			toast.error(data.message);
		});

		socket.on('gateway:delete-process-success', (data) => {
			deleteElements({ nodes: [{ id: data }] });
			appDispatch({ type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS, payload: data });
		});

		socket.on('gateway:connector-created', (data: CreateConnectorRes) => {
			const sanitizedData = omitBy<CreateConnectorRes>(data, isNull);

			if (sanitizedData.updatedProcess) {
				flushSync(() =>
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
					)
				);
				updateNodeInternal(sanitizedData.updatedProcess?.processId as string);

				setEdges((edges) => [...edges, sanitizedData.connector as Edge]);
			}
		});

		socket.on('connect_error', (err) => {
			console.error('Connection error:', err.message);
		});

		return () => {
			socket.disconnect();
		};
	}, [app.userProfile?.id, appDispatch, addEdges, deleteElements, setEdges, setNodes, updateNodeInternal]);

	const onConnect = useCallback(
		(param: Connection) => {
			const value = omitBy(
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

	useEffect(() => {
		setMoreNodes((nodes) =>
			nodes.map((item) => ({
				...item,
				hidden: sheetState.process?.id ? item.id !== sheetState.process.id : false,
				draggable: sheetState.process === undefined ? true : false,
			}))
		);
		setMoreEdges((edge) =>
			edge.map((item) => ({
				...item,
				hidden: sheetState.process?.id ? item.id !== sheetState.process.id : false,
				draggable: sheetState.process === undefined ? true : false,
			}))
		);
	}, [sheetState.process, setViewport, setMoreNodes, setMoreEdges]);

	const handleNodeDragStop = useCallback((_event: MouseEvent, node: Node<CabonerfNodeData>) => {
		socket.emit('gateway:node-update-position', { id: node.id, x: node.position.x, y: node.position.y });
	}, []);

	const handlePanelClick = useCallback(() => {
		if (sheetState.process) {
			sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
			setViewport({ x: 0, y: 0, zoom: 0.7 }, { duration: 800 });
		}
	}, [setViewport, sheetDispatch, sheetState]);

	const canPaneScrollAndDrag = useMemo(() => sheetState.process === undefined, [sheetState.process]);

	if (isFetching) return <LoadingProject />;

	return (
		<React.Fragment>
			<PlaygroundControlContextProvider>
				<div className="relative h-[calc(100vh-59px)] text-[#333333]">
					<PlaygroundHeader id={project?.id as string} />
					<ReactFlow
						defaultViewport={{ zoom: 0.7, x: 0, y: 0 }}
						className="relative bg-[#eeeeee]"
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
						connectionLineComponent={ConnectionLine}
						onEdgesChange={onEdgesChange}
						onlyRenderVisibleElements
						onNodeDragStop={handleNodeDragStop}
					>
						<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
						<Panel position="top-left">
							<PlaygroundActionToolbar />
						</Panel>
						<PlaygroundToolBoxV2 />

						<Panel position="bottom-center">
							<PlaygroundControls impacts={project?.impacts as Impact[]} projectId={project?.id as string} />
						</Panel>
					</ReactFlow>
					{sheetState.process && <SheetbarSide />}
				</div>
			</PlaygroundControlContextProvider>
		</React.Fragment>
	);
}
