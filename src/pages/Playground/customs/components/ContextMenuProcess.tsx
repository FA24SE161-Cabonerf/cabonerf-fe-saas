import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { contextMenu } from '@/pages/Playground/contexts/contextmenu.context';
import socket from '@/socket.io';
import { useReactFlow } from '@xyflow/react';
import { Leaf, Pencil, Trash2 } from 'lucide-react';
import { forwardRef, useContext } from 'react';

const ContextMenuProcess = forwardRef<HTMLDivElement, unknown>((_, ref) => {
	const { deleteElements } = useReactFlow();
	const { app } = useContext(contextMenu);

	const handleDeleteNodeProcess = () => {
		socket.emit('node:delete', app.contextMenuSelector?.id);

		deleteElements({
			nodes: [{ id: app.contextMenuSelector?.id as string }],
		});
	};

	return (
		<div
			ref={ref}
			style={{
				position: 'absolute',
				top: app.contextMenuSelector?.clientY,
				left: app.contextMenuSelector?.clientX,
			}}
			className="transition-all duration-300"
		>
			<div className="w-[250px] rounded-xl border-[0.5px] bg-white shadow transition-all duration-500">
				<div className="px-3 py-2 text-sm font-medium">Edit process</div>
				<Separator />
				<div className="py-2 text-gray-400">
					<div className="flex flex-col">
						<span className="px-3 py-1 text-xs">Process color</span>
						<div className="flex justify-between px-3">
							{Array(5)
								.fill(0)
								.map((_, index) => (
									<div key={index} className="size-9 rounded-full border"></div>
								))}
						</div>
					</div>
					<div className="mt-2 flex flex-col">
						<span className="px-3 py-1 text-xs">Options</span>
						<div className="p-1">
							<Button variant="ghost" className="flex w-full justify-start space-x-2 rounded-sm px-2 font-normal text-black">
								<Pencil size={15} />
								<span>Edit Process Details</span>
							</Button>
							<Button variant="ghost" className="flex w-full justify-start space-x-2 rounded-sm px-2 font-normal text-black">
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
});

export default ContextMenuProcess;
