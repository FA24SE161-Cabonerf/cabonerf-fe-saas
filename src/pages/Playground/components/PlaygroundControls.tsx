import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ControlItem from '@/pages/Playground/components/ControlItem';
import socket from '@/socket.io';
import { useReactFlow } from '@xyflow/react';
import { ChartColumnBig, Pencil, Play, Scan, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';

const FIT_VIEW = 1000;
const ZOOM = 150;

function PlaygroundControls() {
	const reactflow = useReactFlow();

	return (
		<div className="relative w-auto transform rounded-full bg-white px-1 shadow-lg duration-300">
			<div className="flex items-center space-x-2 p-1.5">
				<div className="flex items-center space-x-2 rounded-full bg-green-200 p-2">
					<Pencil size={17} strokeWidth={2} color="green" />
					<span className="text-[13px] font-medium text-green-700">Editing</span>
				</div>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomIn}>
					<ZoomIn size={19} strokeWidth={2} color="#6b7280" />
				</ControlItem>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomOut}>
					<ZoomOut size={19} strokeWidth={2} color="#6b7280" />
				</ControlItem>
				<ControlItem duration={FIT_VIEW} onAction={reactflow.fitView}>
					<Scan size={19} strokeWidth={2} color="#6b7280" />
				</ControlItem>
				<ControlItem>
					<ChartColumnBig size={19} strokeWidth={2} color="#6b7280" />
				</ControlItem>

				<Separator orientation="vertical" className="h-6" color="black" />

				<Button
					className="space-x-3 rounded-full text-[13px] font-normal shadow-md shadow-green-300"
					onClick={() => socket.emit('gateway:process-create', 'asd')}
				>
					<Play size={16} fill="white" color="white" /> <span>Calculate LCA</span>
				</Button>
			</div>
		</div>
	);
}

export default React.memo(PlaygroundControls);
