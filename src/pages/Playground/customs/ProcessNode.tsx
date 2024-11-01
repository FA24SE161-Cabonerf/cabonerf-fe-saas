import { ContextDispatch } from '@/@types/dispatch.type';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import { processImpacts } from '@/utils/mockdata';
import { updateSVGAttributes } from '@/utils/utils';
import { Node as NodeFlow, NodeProps } from '@xyflow/react';
import DOMPurify from 'dompurify';
import { MoreHorizontal, ThermometerSnowflake, ThermometerSnowflakeIcon } from 'lucide-react';
import { MouseEvent as ReactMouseEvent, useContext, useEffect, useRef } from 'react';

interface NodeDataTemp {
	id: string;
	name: string;
	lifeCycleStages: {
		id: string;
		name: string;
		iconUrl: string;
	};
	[key: string]: unknown;
}

type ProcessNode = NodeFlow<NodeDataTemp, 'process'>;

export default function ProcessNode({ id, width, data: { name, lifeCycleStages } }: NodeProps<ProcessNode>) {
	const { app, dispatch } = useContext(contextMenu);
	const triggerRef = useRef<HTMLDivElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const isOutsideClick =
				!triggerRef.current?.contains(event.target as Node) && !contextMenuRef.current?.contains(event.target as Node);
			if (app.contextMenuSelector && isOutsideClick) {
				dispatch({ type: ContextDispatch.CLEAR_CONTEXT_MENU });
			}
		};

		document.addEventListener('contextmenu', handleClickOutside);
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('contextmenu', handleClickOutside);
			document.removeEventListener('click', handleClickOutside);
		};
	}, [app.contextMenuSelector, dispatch]);

	const handleTriggerContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		dispatch({
			type: ContextDispatch.SET_CONTEXT_MENU,
			payload: { id, clientX: event.nativeEvent.offsetX, clientY: event.nativeEvent.offsetY },
		});
	};

	return (
		<Sheet>
			<div
				onContextMenu={handleTriggerContextMenu}
				ref={triggerRef}
				style={{ width }}
				className="relative rounded-2xl border-[1px] border-gray-100 bg-white shadow-md"
			>
				<div className="p-4">
					<div className="flex items-center justify-between space-x-2">
						{/* Logo */}
						<div className="flex items-center space-x-1">
							<div className="rounded bg-[#16a34a] p-1">
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											updateSVGAttributes({
												svgString: lifeCycleStages.iconUrl,
												properties: { color: 'white', fill: 'white', height: 13, width: 13 },
											})
										),
									}}
								/>
							</div>
							<span className="text-xs text-gray-700">{lifeCycleStages.name}</span>
						</div>
						{/* CTA */}
						<SheetTrigger className="cursor-pointer rounded-sm p-1 duration-200 hover:bg-gray-100">
							<MoreHorizontal color="#525252" strokeWidth={3} size={15} />
						</SheetTrigger>
					</div>
					<div className="mt-3 break-words text-xl font-medium">{name}</div>
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
				{app.contextMenuSelector?.id === id && (
					<div
						ref={contextMenuRef}
						style={{
							position: 'absolute',
							top: `${app.contextMenuSelector.clientY}px`,
							left: `${app.contextMenuSelector.clientX}px`,
						}}
						className="z-50 h-[100px] w-[200px] cursor-pointer overflow-visible border bg-white p-5"
					>
						Context menu
					</div>
				)}
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
