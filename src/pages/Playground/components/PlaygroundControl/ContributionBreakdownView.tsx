import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

type TransformContributor = {
	processId: string;
	net?: number;
	total?: number;
	subProcesses: TransformContributor[];
};

export const mockData = {
	processId: '3a4f334f-9b0c-4fbd-b855-f652b7cccfa3',
	subProcesses: [
		{
			processId: '3a4f334f-9b0c-4fbd-b855-f652b7cccfa3',
			net: 1,
			subProcesses: [],
		},
		{
			processId: '44df37c2-d396-438d-b84b-bc3b5b3b99a5',
			subProcesses: [],
			net: 1,
		},
		{
			processId: 'cff0a5a1-156d-47a7-bd2a-3ade6030bc8f',
			subProcesses: [
				{
					processId: 'cff0a5a1-156d-47a7-bd2a-3ade6030bc8f',
					net: 2,
					subProcesses: [],
				},
				{
					processId: 'a29fc89a-df93-4b27-9e59-425fb5b40b5b',
					subProcesses: [],
					net: 4,
				},
			],
			total: 2,
		},
		{
			processId: '11314426-017e-4539-9ac2-4eb330a118a8',
			subProcesses: [
				{
					processId: '11314426-017e-4539-9ac2-4eb330a118a8',
					net: 0.5,
					subProcesses: [],
				},
				{
					processId: 'a29fc89a-df93-4b27-9e59-425fb5b40b5b',
					subProcesses: [],
					net: 1,
				},
				{
					processId: '44df37c2-d396-438d-b84b-bc3b5b3b99a5',
					subProcesses: [],
					net: 0.5,
				},
			],
			total: 0.5,
		},
	],
	total: 1,
};

type Props = {
	data: TransformContributor;
	depth: number;
};

const ValueContribute = () => {
	return (
		<div className="flex text-base">
			<div>Value</div>
			<div className="border">Percent</div>
		</div>
	);
};

export const TreeView = ({ data, depth }: Props) => {
	const [isOpen, setIsOpen] = useState<boolean>(true);

	return (
		<div>
			{data.subProcesses.length > 0 ? (
				<Collapsible open={isOpen} onOpenChange={setIsOpen} className={`w-full space-y-2 border`}>
					<div className="flex w-full items-center space-x-4">
						<div className="flex w-full justify-between">
							<div className="flex">
								<CollapsibleTrigger asChild>
									<Button variant="ghost" size="sm" className="w-9 p-0">
										<ChevronsUpDown className="h-4 w-4" />
										<span className="sr-only">Toggle</span>
									</Button>
								</CollapsibleTrigger>
								<div className="text-sm font-semibold">-{data.processId}</div>
							</div>
							<ValueContribute />
						</div>
					</div>
					<CollapsibleContent className="space-y-2" style={{ paddingLeft: depth * 10 }}>
						{data.subProcesses.map((item, index) => (
							<TreeView key={index} depth={depth + 1} data={item} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : (
				<div className="flex justify-between text-sm font-light" style={{ paddingLeft: depth * 10 }}>
					-{data.processId}
					<ValueContribute />
				</div>
			)}
		</div>
	);
};

type Propss = {};

export default function ContributionBreakdownView({ data }: { data: TransformContributor }) {
	return (
		<div className="h-[500px] w-[800px] overflow-scroll p-2">
			<TreeView data={data} depth={1} />
		</div>
	);
}
