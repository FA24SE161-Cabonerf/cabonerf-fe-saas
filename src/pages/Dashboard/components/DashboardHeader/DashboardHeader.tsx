import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileUp, Plus, Telescope, Workflow } from 'lucide-react';

export default function DashboardHeader() {
	return (
		<div className="mx-6 mt-3">
			<div className="flex items-end justify-between">
				<div className="flex flex-col leading-7">
					<span className="text-2xl font-medium">Projects</span>
					<span className="font-normal tracking-wide text-gray-400">
						All Life Cycle Assessment projects in this workspace
					</span>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant={'outline'} className="space-x-1 rounded-sm font-normal">
						<span>Explore templates</span>
						<Telescope size={17} strokeWidth={2} />
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center space-x-1 rounded-sm bg-primary px-3 py-1.5 text-sm text-white outline-none">
							<span>Create LCA</span>
							<Plus size={17} strokeWidth={2} />
						</DropdownMenuTrigger>
						<DropdownMenuContent className="rounded-sm">
							<DropdownMenuItem className="space-x-1.5 rounded-[3.5px]">
								<Workflow size={17} strokeWidth={2} />
								<span>Blank Project</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="space-x-1.5 rounded-[3.5px]">
								<FileUp size={17} strokeWidth={2} />
								<span>Import</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<div className="mt-2">
				<div className="h-[140px] rounded-2xl bg-stone-300"></div>
			</div>
		</div>
	);
}
