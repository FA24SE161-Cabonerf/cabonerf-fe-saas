import ToolboxLifeCycleStages from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxLifeCycleStages';
import ToolboxMenu from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxMenu';
import ToolboxTrigger from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxTrigger';
import Toolbox from '@/pages/Playground/components/PlaygroundToolBoxV2/context/toolbox.context';
import { Blocks, DatabaseZap, Package, SquarePlus, StickyNote, Type } from 'lucide-react';
import React from 'react';

function PlaygroundToolBoxV2() {
	return (
		<Toolbox>
			<div className="absolute top-1/2 z-50 ml-[15px] -translate-y-1/2 rounded-[15px] bg-white px-1.5 py-3 shadow-md">
				<div className="flex flex-col items-center space-y-2">
					<ToolboxTrigger iconRenderProps={<SquarePlus size={20} />} />
					<ToolboxTrigger id="2" iconRenderProps={<Blocks />} />
					<ToolboxTrigger id="3" iconRenderProps={<DatabaseZap />} />
					<ToolboxTrigger id="4" iconRenderProps={<Package size={20} />} />
					<ToolboxTrigger id="5" iconRenderProps={<Type size={20} />} />
					<ToolboxTrigger id="6" iconRenderProps={<StickyNote size={20} />} />
				</div>
				<ToolboxMenu id="2">
					<ToolboxLifeCycleStages />
				</ToolboxMenu>
				<ToolboxMenu id="3">
					<div className="flex h-[500px] w-[400px] flex-col">
						<h2 className="mb-3 text-[17px] font-medium">Life Cycle Stage</h2>
						<p className="text-sm">
							Customize the Life Cycle Stage by selecting relevant components to tailor the assessment to specific requirements.
						</p>
					</div>
				</ToolboxMenu>
				<ToolboxMenu id="4">
					<div>Menu 4</div>
				</ToolboxMenu>
				<ToolboxMenu id="5">
					<div>Menu 5</div>
				</ToolboxMenu>
				<ToolboxMenu id="6">
					<div>Menu 6</div>
				</ToolboxMenu>
			</div>
		</Toolbox>
	);
}

export default React.memo(PlaygroundToolBoxV2);
