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

import React, { MouseEvent, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Impact } from '@/@types/project.type';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import CustomSuccessSooner from '@/components/CustomSooner';
import WarningSooner from '@/components/WarningSooner';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import ConnectionLine from '@/pages/Playground/components/ConnectionLine';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundControlContextProvider from '@/pages/Playground/contexts/playground-control.context';
import ProcessEdge from '@/pages/Playground/edges/ProcessEdge';
import { CreateCabonerfNodeReqBody } from '@/schemas/validation/nodeProcess.schema';
import { updateSVGAttributes } from '@/utils/utils';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import DOMPurify from 'dompurify';
import { isNull, omitBy } from 'lodash';
import { flushSync } from 'react-dom';
import { ReloadIcon } from '@radix-ui/react-icons';

const customEdge: EdgeTypes = {
	process: ProcessEdge,
};

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

export default function Playground() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
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
		refetchOnMount: true,
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
			setIsLoading(false);
			toast(<CustomSuccessSooner data={data.data.lifeCycleStage} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
		});
	}, [addNodes, playgroundDispatch]);

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
		setIsLoading(true);
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

									{isLoading ? (
										<div className="absolute -top-2 left-1/2 flex h-[50px] -translate-x-1/2 -translate-y-full scale-100 items-center space-x-2 rounded-[18px] bg-black p-[15px] text-white opacity-100 shadow-lg transition-all duration-300 ease-out">
											<ReloadIcon className="h-3 animate-spin font-bold" />
											<span className="visible text-[12px] font-semibold">Inserting...</span>
										</div>
									) : (
										<div className="absolute -top-2 left-1/2 -z-10 flex h-[50px] -translate-x-1/2 -translate-y-full scale-95 items-center space-x-2 rounded-[18px] bg-black p-[15px] text-white opacity-0 shadow-lg transition-all duration-300 ease-out">
											<ReloadIcon className="h-3 font-bold" />
											<span className="invisible text-[12px] font-semibold">Inserting...</span>
										</div>
									)}
								</Panel>
							</ReactFlow>
						</ContextMenuTrigger>
						<ContextMenuContent className="w-auto rounded-[10px] border-none p-0">
							<div className="w-full">
								<div className="flex w-full gap-2 p-[5px]">
									{lifeCycleStagesQuery.data?.data.data.map((item) => (
										<ContextMenuItem
											onClick={addNewNode({ lifeCycleStageId: item.id })}
											key={item.id}
											className="cursor-pointer space-x-2 p-2 focus:bg-[#22c55e] focus:text-white"
											asChild
										>
											<div
												className="hover:text-white"
												dangerouslySetInnerHTML={{
													__html: DOMPurify.sanitize(
														updateSVGAttributes({
															svgString: item.iconUrl,
															properties: {
																height: 20,
																width: 20,
																fill: 'none',
																color: 'currentColor',
																strokeWidth: 1.5,
															},
														})
													),
												}}
											/>
										</ContextMenuItem>
									))}
								</div>
								<Separator className="bg-[#eeeeee]" />
								<div className="p-[5px]">
									<ContextMenuItem className="flex items-center justify-start space-x-2 rounded-[5px] px-[10px] focus:bg-[#22c55e] focus:text-white">
										{/* <Package size={18} color="#6b7280" /> */}

										<span className="text-[12px] capitalize">Add Note</span>
									</ContextMenuItem>
									<ContextMenuItem className="flex items-center justify-start space-x-2 rounded-[5px] px-[10px] focus:bg-[#22c55e] focus:text-white">
										<span className="text-[12px] capitalize">Add Text</span>
										{/* <Package size={18} color="#6b7280" /> */}
									</ContextMenuItem>
									<ContextMenuItem className="flex items-center justify-start space-x-2 rounded-[5px] px-[10px] focus:bg-[#22c55e] focus:text-white">
										<span className="text-[12px] capitalize">Sort By</span>
										{/* <Package size={18} color="#6b7280" /> */}
									</ContextMenuItem>
								</div>
							</div>
						</ContextMenuContent>
					</ContextMenu>

					{sheetState.process && <SheetbarSide />}
				</div>
			</PlaygroundControlContextProvider>
		</React.Fragment>
	);
}
