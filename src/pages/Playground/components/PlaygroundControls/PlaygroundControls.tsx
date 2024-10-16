import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ControlItem from '@/pages/Playground/components/ControlItem';
import MenuExport from '@/pages/Playground/components/MenuExport';
import { useReactFlow } from '@xyflow/react';
import { ArrowDownFromLine, Pencil, Play, Scan, Share, ZoomIn, ZoomOut } from 'lucide-react';
import React, { useState } from 'react';

const FIT_VIEW = 1000;
const ZOOM = 150;

function PlaygroundControls() {
	const [isShareMenu, setIsShareMenu] = useState<boolean>(false);

	const reactflow = useReactFlow();

	const toggleShareMenu = () => setIsShareMenu((prevState) => !prevState);

	return (
		<div className="relative w-auto transform rounded-md border border-gray-100 bg-white shadow-lg duration-300">
			<MenuExport isShareMenu={isShareMenu} />
			<div className="flex items-center space-x-2 p-[8px]">
				<div className="flex items-center space-x-2 rounded-sm bg-green-200 p-2">
					<Pencil size={17} strokeWidth={1.5} color="green" />
					<span className="text-[13px] font-medium text-green-700">Editing</span>
				</div>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomIn}>
					<ZoomIn size={19} strokeWidth={1.5} />
				</ControlItem>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomOut}>
					<ZoomOut size={19} strokeWidth={1.5} />
				</ControlItem>
				<ControlItem duration={FIT_VIEW} onAction={reactflow.fitView}>
					<Scan size={19} strokeWidth={1.5} />
				</ControlItem>
				<ControlItem isActive={!!isShareMenu} duration={18} onAction={toggleShareMenu}>
					{isShareMenu ? <ArrowDownFromLine strokeWidth={1.5} size={19} /> : <Share strokeWidth={1.5} size={19} />}
				</ControlItem>
				<Separator orientation="vertical" className="h-6" color="black" />

				<Button className="back space-x-3 rounded-sm text-[13px] font-normal">
					<Play size={16} fill="white" color="white" /> <span>Calculate LCA</span>
				</Button>
			</div>
		</div>
	);
}

export default React.memo(PlaygroundControls);
