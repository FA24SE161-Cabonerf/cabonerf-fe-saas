import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ContextDispatch } from '@/@types/dispatch.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import ContextMenuProcess from '@/pages/Playground/components/ContextMenuProcess';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import { processImpacts } from '@/utils/mockdata';
import { updateSVGAttributes } from '@/utils/utils';
import { NodeProps, Node as NodeReactFlow } from '@xyflow/react';
import DOMPurify from 'dompurify';
import { MoreHorizontal, ThermometerSnowflake, ThermometerSnowflakeIcon } from 'lucide-react';
import React, { useContext, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

type CabonerfNodeProps = NodeReactFlow<CabonerfNodeData & { [key: string]: unknown }, 'process'>;

export default function ProcessNode(data: NodeProps<CabonerfNodeProps>) {
	const { app, dispatch } = useContext(contextMenu);
	const triggerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

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
				id: data.id,
				clientX: event.pageX,
				clientY: event.pageY,
			},
		});
	};

	return (
		<Sheet>
			<div
				onContextMenu={handleTriggerContextMenu}
				ref={triggerRef}
				className="w-[370px] rounded-3xl border-[1px] border-gray-100 bg-white shadow-md"
			>
				<div className="p-4">
					<div className="flex items-center justify-between space-x-2">
						{/* Logo */}
						<div className="flex items-start space-x-1">
							<div className="rounded-md bg-[#a3a3a3] p-2">
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											updateSVGAttributes({
												svgString: data.data.lifeCycleStages.iconUrl,
												properties: { color: 'white', fill: 'white', height: 20, width: 20 },
											})
										),
									}}
								/>
							</div>
						</div>
						{/* CTA */}

						<SheetTrigger className="cursor-pointer rounded-sm p-1 duration-200 hover:bg-gray-100">
							<MoreHorizontal color="#525252" strokeWidth={3} size={15} />
						</SheetTrigger>
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
								{processImpacts.map((item, index) => (
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
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				{/* Context Menu */}
				{app.contextMenuSelector?.id === data.id && ReactDOM.createPortal(<ContextMenuProcess ref={contextMenuRef} />, document.body)}
			</div>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription>
						This action cannot be undone. This will permanently delete your account and remove your data from our servers.
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
}
