import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ContextDispatch } from '@/@types/dispatch.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AppContext } from '@/contexts/app.context';
import ContextMenuProcess from '@/pages/Playground/components/ContextMenuProcess';
import HandleProductItem from '@/pages/Playground/components/HandleProductItem';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { formatWithExponential, updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Handle, NodeProps, Node as NodeReactFlow, Position, useConnection } from '@xyflow/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { DatabaseZap, Info } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom';

export type CabonerfNodeProps = NodeReactFlow<CabonerfNodeData, 'process'>;

function ProcessNode(data: NodeProps<CabonerfNodeProps>) {
	const connection = useConnection();

	const { playgroundState } = useContext(PlaygroundContext);
	const { app: appContext } = useContext(AppContext);
	const { app, dispatch } = useContext(contextMenu);
	const { sheetState } = useContext(SheetbarContext);

	const triggerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

	const isTarget = connection.inProgress && connection.fromNode.id !== data.id;

	const unitValue = useMemo(
		() => data.data.impacts.find((item) => item.impactCategory.id === playgroundState.impactCategory?.id)?.unitLevel,
		[data.data.impacts, playgroundState.impactCategory?.id]
	);
	// Handle context menu
	useEffect(() => {
		const handleContextMenuEvent = (event: MouseEvent) => {
			if (
				app.contextMenuSelector &&
				triggerRef.current &&
				!triggerRef.current.contains(event.target as Node) &&
				contextMenuRef.current &&
				!contextMenuRef.current.contains(event.target as Node)
			) {
				dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });
			}
		};

		const handleClickEvent = (event: MouseEvent) => {
			if (app.contextMenuSelector && contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
				dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });
			} else {
				return;
			}
		};

		document.addEventListener('contextmenu', handleContextMenuEvent);

		document.addEventListener('click', handleClickEvent);

		return () => {
			document.removeEventListener('contextmenu', handleContextMenuEvent);

			document.removeEventListener('click', handleClickEvent);
		};
	}, [dispatch, data.id, app.contextMenuSelector]);

	const handleTriggerContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		event.preventDefault();
		event.stopPropagation();

		dispatch({
			type: ContextDispatch.SET_CONTEXT_MENU,
			payload: {
				process: { ...data.data, id: data.id },
				clientX: event.pageX,
				clientY: event.pageY,
			},
		});
	};

	const productExchangeInput = useMemo(() => {
		return data.data.exchanges.filter((item) => item.input === true && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174000');
	}, [data.data.exchanges]);

	const productExchangeOutput = useMemo(() => {
		return data.data.exchanges.find((item) => item.input === false && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174000');
	}, [data.data.exchanges]);

	return (
		<TooltipProvider delayDuration={200}>
			<div
				onContextMenu={handleTriggerContextMenu}
				ref={triggerRef}
				style={{
					zIndex: 50,
					backgroundColor: data.data.bgColor,
					boxShadow: `0 5px 15px -2px ${data.data.bgColor}`,
					outlineColor: data.data.bgColor,
				}}
				className={clsx(`relative h-fit w-[380px] rounded-[28px] transition-transform`, {
					'scale-105': data.dragging,
					'outline-dashed outline-[3px] outline-offset-4': sheetState.process?.id === data.id || data.dragging === true,
				})}
			>
				{/* Default Target */}
				<Handle
					position={Position.Left}
					type="target"
					id={undefined}
					className={clsx(`absolute left-1/2 top-0 h-full w-full -translate-x-1/2 rounded-none bg-none`, {
						invisible: !isTarget,
						'visible opacity-0': isTarget,
					})}
				/>

				{/* Default Source */}
				<Handle
					position={Position.Left}
					type="source"
					id={undefined}
					className={clsx(`absolute left-1/2 top-0 h-full w-full -translate-x-1/2 rounded-none bg-none`, {
						invisible: !isTarget,
						'visible opacity-0': isTarget,
					})}
				/>

				<div className="p-4">
					<div className="flex items-center justify-between space-x-2">
						{/* Logo */}
						<div className="flex items-start space-x-1">
							<div className="rounded-md p-1.5" style={{ backgroundColor: data.data.color }}>
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											updateSVGAttributes({
												svgString: data.data.lifeCycleStage.iconUrl,
												properties: { color: 'white', fill: 'white', height: 20, width: 20 },
											})
										),
									}}
								/>
							</div>
						</div>
						{/* CTA */}
					</div>
					<div className="mt-3 flex justify-between break-words text-xl font-semibold text-white">{data.data.name}</div>
					<div className="mt-4">
						{playgroundState.impactCategory && data.data.impacts.length > 0 && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button className="flex items-center space-x-2 rounded p-0.5 text-xs text-white transition-all hover:bg-gray-100 hover:bg-opacity-20">
										<div
											dangerouslySetInnerHTML={{
												__html: DOMPurify.sanitize(
													updateSVGAttributes({
														svgString: playgroundState.impactCategory?.iconUrl ?? ('' as string),
														properties: {
															color: '#fff',
															fill: 'none',
															height: 20,
															width: 20,
														},
													})
												),
											}}
										/>
										<div className="flex items-center space-x-1">
											<span className="font-bold">{formatWithExponential(unitValue ?? 0)}</span>
											<span>{playgroundState.impactCategory?.midpointImpactCategory.unit.name}</span>
										</div>
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="max-h-[400px] w-[650px] overflow-y-scroll scroll-smooth p-0">
									<div className="sticky left-0 right-0 top-0 grid grid-cols-12 border-b bg-white px-2 py-1.5">
										<div className="col-span-8 mx-auto text-sm font-semibold">Impact Category</div>
										<div className="col-span-2 text-sm font-semibold">Unit Level</div>
										<div className="col-span-2 text-sm font-semibold">System Level</div>
									</div>

									{data.data.impacts.map((item, index) => (
										<div key={index} className="grid grid-cols-12 space-y-1 px-2 py-0.5">
											<div className="col-span-8 flex items-center space-x-3">
												<div
													dangerouslySetInnerHTML={{
														__html: DOMPurify.sanitize(updateSVGAttributes({ svgString: item.impactCategory.iconUrl })),
													}}
												/>
												<div className="flex flex-col">
													<span className="text-sm font-medium">{item.impactCategory.name}</span>
													<span className="text-xs text-gray-500">
														{item.impactCategory.midpointImpactCategory.name} (
														{item.impactCategory.midpointImpactCategory.abbr})
													</span>
												</div>
											</div>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="col-span-2 text-sm font-medium">{formatWithExponential(item.unitLevel)}</div>
												</TooltipTrigger>
												<TooltipContent className="bg-black">{item.unitLevel}</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger asChild>
													<div className="col-span-2 text-sm font-medium">{formatWithExponential(item.systemLevel)}</div>
												</TooltipTrigger>
												<TooltipContent className="bg-black">{item.systemLevel}</TooltipContent>
											</Tooltip>
										</div>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						)}
					</div>
					{/* <div className="flex min-h-[17px] justify-end">
					<div className="rounded p-1 hover:bg-gray-100">
						<LockKeyhole size={17} />
					</div>
				</div> */}
				</div>
				{/* Handle */}

				{/* Delete */}
				{appContext.deleteProcessesIds.includes(data.id) && (
					<>
						<div className="absolute left-0 top-0 z-30 h-full w-full rounded-[26px] bg-gray-100 bg-gray-100/30"></div>
						<div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
							<ReloadIcon className="mr-2 h-5 w-5 animate-spin text-zinc-500" />
						</div>
					</>
				)}

				<div className="flex items-start justify-between gap-1">
					{productExchangeInput.length > 0 && (
						<div className="mb-2 w-1/2 space-y-1">
							{productExchangeInput.map((item) => (
								<HandleProductItem
									bgColor={data.data.bgColor}
									library={data.data.library}
									processId={data.id}
									data={item}
									key={item.id}
								/>
							))}
						</div>
					)}

					{productExchangeOutput && (
						<div className="mb-2 ml-auto w-1/2">
							<HandleProductItem
								bgColor={data.data.bgColor}
								library={data.data.library}
								processId={data.id}
								isReverse
								data={productExchangeOutput}
							/>
						</div>
					)}
				</div>

				<div className="mx-3 flex items-center justify-end space-x-1 pb-3">
					{data.data.library && (
						<div style={{ color: data.data.color }} className="group relative rounded p-0.5 hover:bg-gray-100 hover:bg-opacity-20">
							<div
								style={{ backgroundColor: data.data.color }}
								className="invisible absolute -top-5 left-1/2 -translate-x-1/2 overflow-visible whitespace-nowrap rounded px-1 py-0.5 text-[10px] text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
							>
								Data Set
							</div>
							<DatabaseZap width={14} height={14} color="white" />
						</div>
					)}
					<div style={{ color: data.data.color }} className="group relative rounded p-0.5 hover:bg-gray-100 hover:bg-opacity-20">
						<div
							style={{ backgroundColor: data.data.color }}
							className="invisible absolute -top-5 left-1/2 -translate-x-1/2 overflow-visible whitespace-nowrap rounded px-1 py-0.5 text-[10px] text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
						>
							Process Details
						</div>
						<Info width={14} height={14} color="white" />
					</div>
				</div>

				{/* Context Menu */}
				{app.contextMenuSelector?.process.id === data.id &&
					app.isOpen &&
					ReactDOM.createPortal(<ContextMenuProcess ref={contextMenuRef} />, document.body)}
			</div>
		</TooltipProvider>
	);
}

export default React.memo(ProcessNode);
