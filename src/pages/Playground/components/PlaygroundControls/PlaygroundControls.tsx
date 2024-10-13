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
	console.log('Ren');
	return (
		<div className="relative w-auto transform rounded-2xl border-t border-gray-50 bg-white shadow-lg duration-300">
			<MenuExport isShareMenu={isShareMenu} />
			<div className="flex items-center space-x-2 p-[8px]">
				<div className="flex items-center space-x-2 rounded-sm bg-green-200 p-2">
					<Pencil size={17} color="green" />
					<span className="text-[13px] font-medium text-green-700">Editing</span>
				</div>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomIn}>
					<ZoomIn size={19} />
				</ControlItem>
				<ControlItem duration={ZOOM} onAction={reactflow.zoomOut}>
					<ZoomOut size={19} />
				</ControlItem>
				<ControlItem duration={FIT_VIEW} onAction={reactflow.fitView}>
					<Scan size={19} />
				</ControlItem>
				<ControlItem
					isActive={!!isShareMenu}
					duration={18}
					onAction={() => setIsShareMenu((prevState) => !prevState)}
				>
					{isShareMenu ? <ArrowDownFromLine size={19} /> : <Share size={19} />}
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
