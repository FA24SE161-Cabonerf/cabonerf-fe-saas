import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import ToolboxLifeCycleStages from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxLifeCycleStages';
import ToolboxMenu from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxMenu';
import ToolboxTrigger from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxTrigger';
import Toolbox from '@/pages/Playground/components/PlaygroundToolBoxV2/context/toolbox.context';
import SheetbarSearchObjectLibrary from '@/pages/Playground/components/SheetbarSearchObjectLibrary';
import { CreateCabonerfNodeTextReqBody } from '@/schemas/validation/nodeProcess.schema';
import socket from '@/socket.io';
import { Blocks, DatabaseZap, Type } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

function PlaygroundToolBoxV2() {
	const params = useParams<{ pid: string }>();

	const handleAddNewText = () => {
		const newNodeText: CreateCabonerfNodeTextReqBody = {
			position: {
				x: 500,
				y: 500,
			},
			projectId: params.pid as string,
			type: 'text',
			fontSize: 16,
		};
		socket.emit('gateway:create-node-text', { data: newNodeText, projectId: params.pid });
	};
	return (
		<Dialog>
			<Toolbox>
				<div className="absolute top-1/2 z-50 ml-[15px] -translate-y-1/2 rounded-[15px] bg-white px-1.5 py-3 shadow-md">
					<div className="flex flex-col items-center space-y-2">
						<ToolboxTrigger id="2" iconRenderProps={<Blocks />} />
						<DialogTrigger id="1" asChild>
							<button className="flex items-center rounded-[9px] p-2 text-[#888888] hover:text-black">
								<DatabaseZap />
							</button>
						</DialogTrigger>

						<button
							onClick={handleAddNewText}
							className="flex items-center rounded-[9px] p-2 text-[#888888] hover:text-black focus:text-black"
						>
							<Type size={20} />
						</button>
					</div>
					<ToolboxMenu id="2">
						<ToolboxLifeCycleStages />
					</ToolboxMenu>
				</div>
			</Toolbox>

			<DialogContent
				className="z-50 border-none p-0 shadow-2xl [&>button]:hidden"
				style={{ maxWidth: 700, width: 700, borderRadius: 16 }}
			>
				<SheetbarSearchObjectLibrary />
			</DialogContent>
			<DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
		</Dialog>
	);
}

export default React.memo(PlaygroundToolBoxV2);
