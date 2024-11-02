import ToolboxLifeCycleStages from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxLifeCycleStages';
import ToolboxMenu from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxMenu';
import ToolboxTrigger from '@/pages/Playground/components/PlaygroundToolBoxV2/components/ToolboxTrigger';
import Toolbox from '@/pages/Playground/components/PlaygroundToolBoxV2/context/toolbox.context';
import { Blocks, DatabaseZap, Package, SquarePlus, StickyNote, Type } from 'lucide-react';

export default function PlaygroundToolBoxV2() {
	return (
		<Toolbox>
			<div className="absolute top-1/2 z-50 ml-[15px] -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-2 shadow">
				<div className="flex flex-col space-y-2">
					<ToolboxTrigger iconRenderProps={(isActive) => <SquarePlus color={isActive ? 'white' : 'black'} />} />
					<ToolboxTrigger id="2" iconRenderProps={(isActive) => <Blocks color={isActive ? 'white' : 'black'} />} />
					<ToolboxTrigger id="3" iconRenderProps={(isActive) => <DatabaseZap color={isActive ? 'white' : 'black'} />} />
					<ToolboxTrigger id="4" iconRenderProps={(isActive) => <Package color={isActive ? 'white' : 'black'} />} />
					<ToolboxTrigger id="5" iconRenderProps={(isActive) => <Type color={isActive ? 'white' : 'black'} />} />
					<ToolboxTrigger id="6" iconRenderProps={(isActive) => <StickyNote color={isActive ? 'white' : 'black'} />} />
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
