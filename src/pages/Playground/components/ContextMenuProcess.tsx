import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';
import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ContextDispatch, eDispatchType, SheetBarDispatch } from '@/@types/dispatch.type';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import socket from '@/socket.io';
import { Edge, Node, useReactFlow } from '@xyflow/react';
import { Leaf, Trash2 } from 'lucide-react';
import React, { forwardRef, useContext, useEffect, useId } from 'react';

const colors = [
	{
		bg: '#FFB454', // Cam đậm hơn pastel
		border: '#FFB454', // Cam rực rỡ, nổi bật
	},
	{
		bg: '#22c55e', // Xanh lá pastel đậm hơn
		border: '#22c55e', // Xanh lá đậm hơn, sống động
	},
	{
		bg: '#3b82f6', // Xanh dương pastel đậm hơn
		border: '#3b82f6', // Xanh dương đậm
	},
	{
		bg: '#ef4444', // Đỏ pastel đậm
		border: '#ef4444', // Đỏ rực rỡ, mạnh mẽ
	},
	{
		bg: '#06b6d4', // Tím pastel đậm hơn
		border: '#06b6d4', // Tím đậm, tinh tế
	},
];

function lightenColor({ hex, amount }: { hex: string; amount: number }) {
	const num = parseInt(hex.replace('#', ''), 16);
	const r = Math.min(255, (num >> 16) + Math.round(255 * amount));
	const g = Math.min(255, ((num >> 8) & 0x00ff) + Math.round(255 * amount));
	const b = Math.min(255, (num & 0x0000ff) + Math.round(255 * amount));
	return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const ContextMenuProcess = React.memo(
	forwardRef<HTMLDivElement, unknown>((_, ref) => {
		const { deleteElements, setNodes, setEdges, fitView } = useReactFlow<Node<CabonerfNodeData>, Edge<CabonerfEdgeData>>();
		const id = useId();
		const { sheetDispatch } = useContext(SheetbarContext);
		const { dispatch } = useContext(AppContext);
		const { app, dispatch: contextDispatch } = useContext(contextMenu);

		useEffect(() => {
			socket.on('gateway:delete-process-success', async (data: string) => {
				deleteElements({
					nodes: [{ id: data }],
				});
				sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
			});
		}, [deleteElements, fitView, sheetDispatch]);

		const handleDeleteNodeProcess = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			socket.emit('gateway:cabonerf-node-delete', app.contextMenuSelector?.process.id);

			dispatch({
				type: eDispatchType.ADD_DELETE_PROCESSES_IDS,
				payload: app.contextMenuSelector?.process.id as string,
			});
			contextDispatch({ type: ContextDispatch.CLOSE_CONTEXT_MENU });
		};

		const handleEditDetail = async () => {
			if (app.contextMenuSelector?.process) {
				sheetDispatch({
					type: SheetBarDispatch.SET_NODE,
					payload: { ...app.contextMenuSelector.process },
				});
				contextDispatch({ type: ContextDispatch.CLOSE_CONTEXT_MENU });

				const length = app.contextMenuSelector.process?.exchanges.filter(
					(item) => item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174000' && item.input === true
				).length;

				await fitView({
					nodes: [{ id: app.contextMenuSelector.process.id }],
					maxZoom: 2.2 - 0.09 * length,
					duration: 700,
					includeHiddenNodes: false,
				});
			}
		};

		const handleChangeColor = (backgroundColor: string, id: string) => {
			socket.emit('gateway:node-update-color', {
				id: id,
				color: backgroundColor,
			});

			socket.on('gateway:update-process-color-success', (dataColor: { id: string; color: string }) => {
				setNodes((nodes) => {
					return nodes.map((node) => (node.id === dataColor.id ? { ...node, data: { ...node.data, color: dataColor.color } } : node));
				});

				setEdges((edges) => {
					return edges.map((edge) =>
						edge.source === dataColor.id
							? {
									...edge,
									style: { ...edge.style, stroke: dataColor.color },
								}
							: edge
					);
				});
			});
		};

		return (
			<div
				id={id}
				ref={ref}
				style={{
					position: 'absolute',
					top: app.contextMenuSelector?.clientY,
					left: app.contextMenuSelector?.clientX,
				}}
				className="transition-all duration-300"
			>
				<div className="w-[230px] rounded-xl border-[0.5px] bg-white shadow transition-all duration-500">
					<div className="px-3 py-2 text-sm font-medium">Edit process</div>
					<Separator />
					<div className="py-2 text-gray-400">
						<div className="flex flex-col">
							<span className="px-3 py-1 text-xs">Process color</span>
							<div className="flex justify-between px-3">
								{colors.map((item) => (
									<button
										onClick={() => handleChangeColor(item.bg, app.contextMenuSelector?.process.id as string)}
										key={item.bg}
										className="size-9 transform rounded-full shadow-sm transition-all duration-200 ease-in-out hover:scale-110 active:scale-100"
										style={{
											border: `1px solid ${item.border}`,
											backgroundColor: item.bg,
										}}
										onMouseEnter={(e) => {
											e.currentTarget.style.backgroundColor = `${lightenColor({ hex: item.bg, amount: 0.09 })}`;
										}}
										onMouseLeave={(e) => {
											e.currentTarget.style.backgroundColor = item.bg;
										}}
									></button>
								))}
							</div>
						</div>
						<div className="mt-2 flex flex-col">
							<span className="px-3 py-1 text-xs">Options</span>
							<div className="p-1">
								<Button
									onClick={handleEditDetail}
									variant="ghost"
									className="flex w-full justify-start space-x-2 rounded-sm px-2 font-normal text-black"
								>
									<Leaf size={15} />
									<span>Edit Elementary Exchanges</span>
								</Button>
							</div>
						</div>
						<div className="mt-2 flex flex-col">
							<div className="px-3 py-1 text-xs">
								<Button
									onClick={handleDeleteNodeProcess}
									variant="destructive"
									className="mx-auto flex h-fit w-fit justify-start space-x-1 rounded-sm bg-[#fef2f2] px-2 hover:bg-[#fee2e2]"
								>
									<Trash2 size={14} color="#ef4444" strokeWidth={2} />
									<span className="text-xs text-[#ef4444]">Delete process</span>
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	})
);

export default ContextMenuProcess;
