import { CabonerfNode, CabonerfNodeData } from '@/@types/cabonerfNode.type';
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
	Background,
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

import { Impact } from '@/@types/project.type';
import WarningSooner from '@/components/WarningSooner';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import ConnectionLine from '@/pages/Playground/components/ConnectionLine';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundControlContextProvider from '@/pages/Playground/contexts/playground-control.context';
import ProcessEdge from '@/pages/Playground/edges/ProcessEdge';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { isNull, omitBy } from 'lodash';
import { Package, StickyNote, Type } from 'lucide-react';
import { flushSync } from 'react-dom';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import DOMPurify from 'dompurify';
import { updateSVGAttributes } from '@/utils/utils';
import { CreateCabonerfNodeReqBody } from '@/schemas/validation/nodeProcess.schema';
import CustomSuccessSooner from '@/components/CustomSooner';
import { Separator } from '@/components/ui/separator';

const customEdge: EdgeTypes = {
	process: ProcessEdge,
};

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

export default function Playground() {
	const {
		deleteElements,
		setViewport,
		addNodes,
		addEdges,
		setNodes: setMoreNodes,
		setEdges: setMoreEdges,
	} = useReactFlow<Node<CabonerfNodeData>>();
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
		refetchOnMount: false,
	});

	const project = projectData?.data.data;

	useEffect(() => {
		const projectName = playgroundState.projectInformation?.name ?? 'Loading...';

		document.title = `${projectName} — Cabonerf`;
	}, [playgroundState.projectInformation?.name]);

	const lifeCycleStagesQuery = useQuery({
		queryKey: ['life-cycle-stage'],
		queryFn: LifeCycleStagesApis.prototype.getAllLifeCycleStages,
		staleTime: 60_000 * 120,
	});

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
			toast(<WarningSooner message={data.message ?? ''} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
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
			}
			setEdges((edges) => [...edges, sanitizedData.connector as Edge]);
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
		socket.on('gateway:create-process-success', (data: CabonerfNode) => {
			addNodes(data);

			toast(<CustomSuccessSooner data={data.data.lifeCycleStage} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
		});
	}, [addNodes]);

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

	const addNewNode = (payload: { lifeCycleStageId: string }) => () => {
		// Get properties of screen
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// Create new node
		const newNode: CreateCabonerfNodeReqBody = {
			projectId: project?.id as string,
			color: '#a3a3a3',
			lifeCycleStageId: payload.lifeCycleStageId,
			position: {
				x: Math.floor(screenWidth / 2 - 400 + Math.random() * 300),
				y: Math.floor(screenHeight / 2 - 400 + Math.random() * 300),
			},
			type: 'process',
		};

		//Emit event to Nodebased Server
		socket.emit('gateway:cabonerf-node-create', newNode);
	};

	if (isFetching) return <LoadingProject />;

	return (
		<React.Fragment>
			<PlaygroundControlContextProvider>
				<div className="relative h-[calc(100vh-59px)] text-[#333333]">
					<PlaygroundHeader id={project?.id as string} />
					<ContextMenu>
						<ContextMenuTrigger>
							<ReactFlow
								defaultViewport={{ zoom: 0.7, x: 0, y: 0 }}
								className="relative"
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
								<Background bgColor="#f4f3f3" />
								<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
								<Panel position="top-left">
									<PlaygroundActionToolbar />
								</Panel>
								<PlaygroundToolBoxV2 />

								<Panel position="bottom-center">
									<PlaygroundControls impacts={project?.impacts as Impact[]} projectId={project?.id as string} />
								</Panel>
							</ReactFlow>
						</ContextMenuTrigger>
						<ContextMenuContent className="w-[200px] p-0">
							<div className="px-3 py-1.5 text-sm font-medium">Manage project:</div>
							<Separator />
							<div className="px-2 pb-2">
								<div className="my-2 flex w-full flex-wrap gap-2">
									{lifeCycleStagesQuery.data?.data.data.map((item) => (
										<ContextMenuItem
											onClick={addNewNode({ lifeCycleStageId: item.id })}
											key={item.id}
											className="flex cursor-pointer space-x-2 bg-gray-50 px-4 py-3 text-gray-600"
										>
											<div
												dangerouslySetInnerHTML={{
													__html: DOMPurify.sanitize(
														updateSVGAttributes({
															svgString: item.iconUrl,
															properties: {
																height: 20,
																width: 20,
																fill: 'none',
																color: '#6b7280',
															},
														})
													),
												}}
											/>
										</ContextMenuItem>
									))}
								</div>
								<ContextMenuItem className="flex cursor-pointer items-center justify-start space-x-2 text-gray-600">
									<Package size={18} color="#6b7280" />
									<span className="text-sm capitalize">Add object</span>
								</ContextMenuItem>
								<ContextMenuItem className="flex cursor-pointer items-center justify-start space-x-2 text-gray-600">
									<Type size={18} color="#6b7280" />
									<span className="text-sm capitalize">Add text</span>
								</ContextMenuItem>
								<ContextMenuItem className="flex cursor-pointer items-center justify-start space-x-2 text-gray-600">
									<StickyNote size={18} color="#6b7280" />
									<span className="text-sm capitalize">Add note</span>
								</ContextMenuItem>
							</div>
						</ContextMenuContent>
					</ContextMenu>

					{sheetState.process && <SheetbarSide />}
				</div>
			</PlaygroundControlContextProvider>
		</React.Fragment>
	);
}
