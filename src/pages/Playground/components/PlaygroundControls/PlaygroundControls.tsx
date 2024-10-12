import ControlItem from '@/components/ControlItem';
import { useReactFlow } from '@xyflow/react';
import { Scan, ZoomIn, ZoomOut } from 'lucide-react';
import React from 'react';

const ZOOM_DURATION = 150;
const FIT_DURATION = 1000;

function PlaygroundControls() {
	const reactFlow = useReactFlow();

	return (
		<div className="flex flex-col space-y-2">
			<ControlItem onAction={reactFlow.zoomIn} duration={ZOOM_DURATION}>
				<ZoomIn size={20} strokeWidth={2} />
			</ControlItem>
			<ControlItem onAction={reactFlow.zoomOut} duration={ZOOM_DURATION}>
				<ZoomOut size={20} strokeWidth={2} />
			</ControlItem>
			<ControlItem onAction={reactFlow.fitView} duration={FIT_DURATION}>
				<Scan size={20} strokeWidth={2} />
			</ControlItem>
		</div>
	);
}

export default React.memo(PlaygroundControls);
// export default PlaygroundControls;
