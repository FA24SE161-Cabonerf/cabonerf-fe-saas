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
	addEdge,
	Background,
	Connection,
	Edge,
	EdgeTypes,
	MiniMap,
	Node,
	NodeMouseHandler,
	NodeTypes,
	Panel,
	ReactFlow,
	useReactFlow,
	useUpdateNodeInternals,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import React, { DragEvent, MouseEvent, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Impact, LifeCycleStageBreakdown } from '@/@types/project.type';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import Cursors from '@/components/Cursor';
import WarningSooner from '@/components/WarningSooner';
import { ContextMenu, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu';
import { Separator } from '@/components/ui/separator';
import useCursorStateSynced from '@/hooks/useCursorStateSynced';
import useEdgesStateSynced from '@/hooks/useEdgesStateSynced';
import useNodesStateSynced from '@/hooks/useNodesStateSynced';
import ConnectionLine from '@/pages/Playground/components/ConnectionLine';
import PlaygroundHeader from '@/pages/Playground/components/PlaygroundHeader';
import PlaygroundControlContextProvider from '@/pages/Playground/contexts/playground-control.context';
import ProcessEdge from '@/pages/Playground/edges/ProcessEdge';
import { CreateCabonerfNodeReqBody, CreateCabonerfNodeTextReqBody } from '@/schemas/validation/nodeProcess.schema';
import { updateSVGAttributes } from '@/utils/utils';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { ReloadIcon } from '@radix-ui/react-icons';
import DOMPurify from 'dompurify';
import { isNull, omitBy } from 'lodash';
import { StickyNote, Type } from 'lucide-react';
import { flushSync } from 'react-dom';

const customEdge: EdgeTypes = {
	process: ProcessEdge,
};

const customNode: NodeTypes = {
	process: ProcessNode,
	text: TextNode,
};

const onDragOver = (event: DragEvent) => {
	event.preventDefault();
	event.dataTransfer.dropEffect = 'move';
};

export default function Playground() {
	const draggingRef = useRef<string | null>(null);
	const [users, setUsers] = useState<{ userId: string; userName: string; userAvatar: string; projectId: string }[]>([]);
	const { sheetDispatch, sheetState } = useContext(SheetbarContext);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { screenToFlowPosition, deleteElements } = useReactFlow<Node<CabonerfNodeData>>();

	const [nodes, setNodes, onNodesChange] = useNodesStateSynced();
	const [edges, setEdges, onEdgesChange] = useEdgesStateSynced();
	const [cursors, onMouseMove] = useCursorStateSynced();

	const updateNodeInternal = useUpdateNodeInternals();

	const { playgroundState, playgroundDispatch } = useContext(PlaygroundContext);
	const { app, dispatch: appDispatch } = useContext(AppContext);
	const params = useParams<{ pid: string }>();

	const { data: project, isFetching } = useQuery({
		queryKey: ['projects', params.pid],
		queryFn: ({ queryKey }) => ProjectApis.prototype.getProjectById({ pid: queryKey[1] as string }),
		enabled: Boolean(params.pid),
		staleTime: 0,
		refetchOnMount: true,
	});

	const lifeCycleStagesQuery = useQuery({
		queryKey: ['life-cycle-stage'],
		queryFn: LifeCycleStagesApis.prototype.getAllLifeCycleStages,
		staleTime: 60_000 * 120,
	});

	useEffect(() => {
		const projectName = playgroundState.projectInformation?.name ?? 'Loading...';

		document.title = `${projectName} — Cabonerf`;
	}, [playgroundState.projectInformation?.name]);

	useEffect(() => {
		if (project) {
			setEdges(project.connectors);
			const merged = [...project.processes, ...(project.texts ?? [])];
			setNodes(merged);

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
	}, [playgroundDispatch, project, setEdges, setNodes]);

	useEffect(() => {
		socket.auth = {
			user_id: app.userProfile?.id,
		};
		socket.connect();

		const infor_user = {
			userId: app.userProfile?.id,
			userName: app.userProfile?.fullName,
			userAvatar: app.userProfile?.profilePictureUrl,
			projectId: params.pid,
		};

		if (params.pid) {
			socket.emit('gateway:join-room', infor_user);
		}

		const joinProcess = (data: React.SetStateAction<{ userId: string; userName: string; userAvatar: string; projectId: string }[]>) => {
			setUsers(data);
		};

		const outRoom = (data: React.SetStateAction<{ userId: string; userName: string; userAvatar: string; projectId: string }[]>) => {
			setUsers(data);
		};

		const deleteProcess = (data: string) => {
			// deleteElements({ nodes: [{ id: data }] });
			appDispatch({ type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS, payload: data });
			setEdges((edges) => edges.filter((item) => item.id !== data));
		};

		const updateFontSize = (data: { data: string; fontSize: number; projectId: string }) => {
			setNodes((nodes) => {
				return nodes.map((node) => (node.id === data.data ? { ...node, data: { ...node.data, fontSize: data.fontSize } } : node));
			});
		};

		const deleteText = (data: { data: string }) => {
			deleteElements({
				nodes: [{ id: data.data }],
			});
		};

		const createEdge = (data: { message: string }) => {
			toast(<WarningSooner message={data.message ?? ''} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
		};

		const handleConnectorCreated = (data: CreateConnectorRes) => {
			const sanitizedData = omitBy<CreateConnectorRes>(data, isNull);

			if (sanitizedData.updatedProcess) {
				flushSync(() =>
					setNodes((nodes) =>
						nodes.map((item) => {
							if (item.id === sanitizedData.updatedProcess?.processId) {
								// Đảm bảo thêm handle mới vào exchanges
								return {
									...item,
									data: {
										...item.data,
										exchanges: [...(item.data.exchanges as never), sanitizedData.updatedProcess.exchange],
									},
								};
							}
							return item;
						})
					)
				);

				// Đợi React Flow render lại node để đảm bảo handle tồn tại
				setTimeout(() => {
					updateNodeInternal(sanitizedData.updatedProcess?.processId as string);

					// Thêm edge vào sau khi handle được thêm
					setEdges((edges) => addEdge(sanitizedData.connector as Edge, edges));
				}, 0);
			}

			setTimeout(() => {
				setEdges((edges) => addEdge(sanitizedData.connector as Edge, edges));
			}, 0);
		};

		socket.on('gateway:user-connect-to-project', joinProcess);

		socket.on('gateway:user-leave-room-success', outRoom);

		socket.on('gateway:delete-process-success', deleteProcess);

		socket.on(`gateway:cabonerf-text-update-fontsize-success`, updateFontSize);

		socket.on(`gateway:delete-text-success`, deleteText);

		socket.on('gateway:error-create-edge', createEdge);

		// Đăng ký sự kiện socket
		socket.on('gateway:connector-created', handleConnectorCreated);

		socket.on('connect_error', (error) => {
			console.error('Connection failed:', error.message);
		});

		return () => {
			socket.emit('gateway:user-leave-room', { userId: app.userProfile?.id, projectId: params.pid });
			socket.off('gateway:user-connect-to-project', joinProcess);
			socket.off('gateway:user-leave-room-success', outRoom);
			socket.off('gateway:delete-process-success', deleteProcess);
			socket.off(`gateway:cabonerf-text-update-fontsize-success`, updateFontSize);
			socket.off(`gateway:delete-text-success`, deleteText);
			socket.off('gateway:error-create-edge', createEdge);
			socket.off('gateway:connector-created', handleConnectorCreated);
			socket.disconnect();
		};
	}, [
		app.userProfile?.id,
		appDispatch,
		setEdges,
		setNodes,
		updateNodeInternal,
		params.pid,
		app.userProfile?.fullName,
		app.userProfile?.profilePictureUrl,
		setUsers,
		deleteElements,
	]);

	useEffect(() => {
		return () => {};
	}, []);

	useEffect(() => {
		socket.on('gateway:create-process-success', (data) => {
			setNodes((nodes) => [...nodes, data]);
			//Optional

			setIsLoading(false);
		});

		socket.on('gateway:created-object-library', (data: CabonerfNode) => {
			setNodes((nodes) => [...nodes, data]);
		});
	}, [params.pid, setNodes]);

	const onDrop = (event: DragEvent) => {
		event.preventDefault();

		const type = event.dataTransfer.getData('application/reactflow');
		const position = screenToFlowPosition({
			x: event.clientX - 80,
			y: event.clientY - 20,
		});
		const newNode: Node = {
			id: `${Date.now()}`,
			type,
			position,
			data: { label: `${type}` },
		};

		setNodes((prev) => [...prev, newNode as Node<CabonerfNodeData>]);
	};

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

	const handlePanelClick = useCallback(() => {
		if (sheetState.process) {
			sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
		}
	}, [sheetDispatch, sheetState]);

	const addNewNode = (payload: { lifeCycleStageId: string }) => (event: MouseEvent) => {
		// Get properties of screen

		const { clientX, clientY } = event;
		const position = screenToFlowPosition({ x: clientX, y: clientY });
		// Create new node
		const newNode: CreateCabonerfNodeReqBody = {
			projectId: project?.id as string,
			lifeCycleStageId: payload.lifeCycleStageId,
			position: position,
			type: 'process',
		};
		setIsLoading(true);
		//Emit event to Nodebased Server
		socket.emit('gateway:cabonerf-node-create', { data: newNode, projectId: params.pid });
	};

	const addNodeText = (event: MouseEvent) => {
		const { clientX, clientY } = event;
		socket.emit('gateway:create-node-text');
		const position = screenToFlowPosition({ x: clientX, y: clientY });
		const newNodeText: CreateCabonerfNodeTextReqBody = {
			position: position,
			projectId: params.pid as string,
			type: 'text',
			fontSize: 16,
		};
		socket.emit('gateway:create-node-text', { data: newNodeText, projectId: params.pid });
	};

	const onNodeDragStart: NodeMouseHandler = useCallback(
		(_, clicked) => {
			// Set the node as currently being dragged
			draggingRef.current = clicked.id;

			// Disable dragging for the currently dragged node
			setNodes((prev) => prev.map((node) => (node.id === clicked.id ? { ...node, selectable: false, draggable: false } : node)));
		},
		[setNodes]
	);

	const handleNodeDragStop: NodeMouseHandler = useCallback(
		(_event: MouseEvent, node) => {
			const data = { id: node.id, x: node.position.x, y: node.position.y };

			if (draggingRef.current === node.id) {
				setNodes((prev) => prev.map((node) => (node.id === node.id ? { ...node, selectable: true, draggable: true } : node)));
				draggingRef.current = null; // Reset dragging state
			}

			socket.emit('gateway:node-update-position', { data, projectId: params.pid });
		},
		[params.pid, setNodes]
	);

	if (isFetching) return <LoadingProject />;

	return (
		<React.Fragment>
			<PlaygroundControlContextProvider>
				<div className="relative h-[calc(100vh-59px)] text-[#333333]">
					<PlaygroundHeader
						projectName={playgroundState.projectInformation?.name ?? 'Reactflow'}
						users={users}
						id={project?.id as string}
					/>
					<ContextMenu>
						<ContextMenuTrigger>
							<ReactFlow
								defaultViewport={{ zoom: 0.7, x: 0, y: 0 }}
								className="relative"
								nodeTypes={customNode}
								minZoom={0.3}
								maxZoom={4}
								edgeTypes={customEdge}
								nodes={nodes}
								edges={edges}
								zoomOnDoubleClick={false}
								onConnect={onConnect}
								proOptions={{ hideAttribution: true }}
								onNodesChange={onNodesChange}
								connectionLineComponent={ConnectionLine}
								onEdgesChange={onEdgesChange}
								onlyRenderVisibleElements
								onPaneClick={handlePanelClick}
								onNodeDragStop={handleNodeDragStop}
								onPointerMove={onMouseMove}
								onNodeDragStart={onNodeDragStart}
								onDrop={onDrop}
								onDragOver={onDragOver}
							>
								<Cursors cursors={cursors} />
								<Background bgColor="#f4f3f3" />
								<MiniMap offsetScale={2} position="bottom-left" pannable zoomable maskColor="#f5f5f5" nodeBorderRadius={3} />
								<Panel position="top-left">
									<PlaygroundActionToolbar />
								</Panel>
								<PlaygroundToolBoxV2 />

								<Panel position="bottom-center">
									<PlaygroundControls
										lifeCycleStageBreakdown={project?.lifeCycleStageBreakdown as LifeCycleStageBreakdown[]}
										impacts={project?.impacts as Impact[]}
										projectId={project?.id as string}
									/>

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
								{/* <DevTools /> */}
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
																fill: 'currentColor',
																color: 'currentColor',
																strokeWidth: 2,
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
									<ContextMenuItem className="flex cursor-pointer items-center justify-start space-x-2 rounded-[5px] px-[10px] focus:bg-[#22c55e] focus:text-white">
										<StickyNote size={18} strokeWidth={1.5} />
										<span className="text-[12px] capitalize">Add Note</span>
									</ContextMenuItem>
									<ContextMenuItem
										onClick={(e) => addNodeText(e)}
										className="flex cursor-pointer items-center justify-start space-x-2 rounded-[5px] px-[10px] focus:bg-[#22c55e] focus:text-white"
									>
										<Type size={18} strokeWidth={1.5} />
										<span className="text-[12px] capitalize">Add Text</span>
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
