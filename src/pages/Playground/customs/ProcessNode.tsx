import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ContextDispatch } from '@/@types/dispatch.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AppContext } from '@/contexts/app.context';
import ContextMenuProcess from '@/pages/Playground/components/ContextMenuProcess';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Handle, NodeProps, Node as NodeReactFlow, Position } from '@xyflow/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { ThermometerSnowflake } from 'lucide-react';
import React, { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export type CabonerfNodeProps = NodeReactFlow<CabonerfNodeData, 'process'>;

function ProcessNode(data: NodeProps<CabonerfNodeProps>) {
	const { sheetState } = useContext(SheetbarContext);
	const { app: appContext } = useContext(AppContext);
	const { app, dispatch } = useContext(contextMenu);

	const triggerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

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
			event.preventDefault();

			if (app.contextMenuSelector && contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
				dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });
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

	return (
		<div
			onContextMenu={handleTriggerContextMenu}
			ref={triggerRef}
			className={clsx(`relative w-[340px] rounded-3xl border-[1px] border-gray-200 bg-white shadow transition-transform`, {
				'scale-105': data.dragging,
				'outline-dashed outline-offset-2 outline-gray-400': data.id === sheetState.process?.id,
			})}
		>
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
				<div className="mt-3 break-words text-xl font-medium">{data.data.name}</div>
				<div className="mt-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<button className="flex items-center space-x-1 rounded p-0.5 text-xs hover:bg-gray-100">
								<ThermometerSnowflake size={15} />
								<div>kg S02-eq</div>
							</button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="max-h-[400px] w-[700px] overflow-y-scroll p-2">
							<div className="grid grid-cols-12 px-2 py-1">
								<div className="col-span-8 mx-auto text-sm font-medium">Impact Category</div>
								<div className="col-span-2 text-sm font-medium">Unit Level</div>
								<div className="col-span-2 text-sm font-medium">System Level</div>
							</div>
							{/* {processImpacts.map((item, index) => (
								<div key={index} className="grid grid-cols-12 space-y-1">
									<div className="col-span-8 flex items-center space-x-3">
										<ThermometerSnowflakeIcon size={20} />
										<div className="flex flex-col">
											<span className="text-sm font-medium">{item.impactCategory.name}</span>
											<span className="text-xs text-gray-500">
												{item.impactCategory.midpointImpactCategory.name} ({item.impactCategory.midpointImpactCategory.abbr})
											</span>
										</div>
									</div>
									<div className="col-span-2 text-sm">123</div>
									<div className="col-span-2 text-sm">123</div>
								</div>
							))} */}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			{/* Handle */}
			<Handle type="source" position={data.sourcePosition as Position}></Handle>

			{/* Delete */}
			{appContext.deleteProcessesIds.includes(data.id) && (
				<>
					<div className="absolute left-0 top-0 z-30 h-full w-full rounded-[22px] border-[1px] border-gray-100 bg-gray-100/80"></div>
					<div className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2">
						<ReloadIcon className="mr-2 h-5 w-5 animate-spin text-zinc-500" />
					</div>
				</>
			)}

			{/* Context Menu */}
			{app.contextMenuSelector?.process.id === data.id &&
				app.isOpen &&
				ReactDOM.createPortal(<ContextMenuProcess ref={contextMenuRef} />, document.body)}
		</div>
	);
}

export default React.memo(ProcessNode);
