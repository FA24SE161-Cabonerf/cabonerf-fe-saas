import ContributeResult from '@/common/icons/ContributeResult';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PlaygroundControlContext } from '@/pages/Playground/contexts/playground-control.context';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { formatPercentage } from '@/utils/utils';
import clsx from 'clsx';
import { Info, Triangle } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';

type TransformContributor = {
	processId: string;
	net?: number;
	total?: number;
	subProcesses: TransformContributor[];
};

type Props = {
	data: TransformContributor;
	depth: number;
};

// Function to calculate gradient colors for percentages
const getEmissionColor = (percentage: number): string => {
	const clampedPercentage = Math.min(100, Math.max(0, percentage));

	if (clampedPercentage <= 50) {
		const green = Math.round(168 + (clampedPercentage / 50) * (255 - 168));
		const red = Math.round(72 + (clampedPercentage / 50) * (255 - 72));
		const blue = Math.round(72 + (clampedPercentage / 50) * (143 - 72));
		return `rgb(${red}, ${green}, ${blue})`;
	}

	const red = 255;
	const green = Math.round(229 - ((clampedPercentage - 50) / 50) * (229 - 127));
	const blue = Math.round(143 - ((clampedPercentage - 50) / 50) * (143 - 127));
	return `rgb(${red}, ${green}, ${blue})`;
};

// Component to display value and percentage contribution
const ValueContribute = ({ value, percentage }: { value: number; percentage: number }) => (
	<div className="flex w-1/2 justify-end text-base">
		<div className="mr-12 text-[13px] font-bold">{value}</div>
		<div className="flex items-center space-x-1 text-[13px]">
			<div className="relative h-[25px] w-[200px] overflow-hidden rounded-sm bg-gray-200 shadow-sm">
				<div
					className="h-full shadow"
					style={{
						width: `${percentage}%`,
						backgroundColor: `${getEmissionColor(percentage)}`,
					}}
				/>
				<div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">{percentage}%</div>
			</div>
		</div>
	</div>
);

// Recursive component to display the tree structure
export const TreeView = ({ data, depth }: Props) => {
	const {
		playgroundState: { impactCategory },
	} = useContext(PlaygroundContext);
	const {
		playgroundControlState: { processes, impacts },
	} = useContext(PlaygroundControlContext);
	const [isOpen, setIsOpen] = useState<boolean>(true);

	// Calculate contributions recursively
	const calculateRecursiveTotal = useMemo(() => {
		if (!impactCategory || !impacts || !processes) return null;

		const totalValueByImpactCategoryId = impacts.find((i) => i.impactCategory.id === impactCategory.id)?.value;

		const calculateNodeContribution = (
			node: TransformContributor,
			rootTotal: number
		): { name: string; value: number; percentage: number; subProcesses: any[] } => {
			const process = processes.find((p) => p.id === node.processId);
			const valueByImpactCategory = process?.impacts.find((i) => i.impactCategory.id === impactCategory.id)?.unitLevel;

			const currentContribution = node.net && valueByImpactCategory ? node.net * valueByImpactCategory : 0;

			const subProcesses = node.subProcesses.map((sub) => calculateNodeContribution(sub, rootTotal));

			const totalForNode = currentContribution + subProcesses.reduce((acc, sub) => acc + sub.value, 0);

			return {
				name: process?.name || 'Unknown Process',
				value: totalForNode,
				percentage:
					totalValueByImpactCategoryId && totalValueByImpactCategoryId !== 0
						? formatPercentage((totalForNode / totalValueByImpactCategoryId) * 100)
						: 0,
				subProcesses,
			};
		};

		const rootTotal = (() => {
			const getTotal = (node: TransformContributor): number => {
				const process = processes.find((p) => p.id === node.processId);
				const valueByImpactCategory = process?.impacts.find((i) => i.impactCategory.id === impactCategory.id)?.unitLevel;

				const currentContribution = node.net && valueByImpactCategory ? node.net * valueByImpactCategory : 0;

				const subProcessesTotal = node.subProcesses.reduce((acc, sub) => acc + getTotal(sub), 0);

				return currentContribution + subProcessesTotal;
			};
			return getTotal(data);
		})();

		return calculateNodeContribution(data, rootTotal);
	}, [data, impactCategory, impacts, processes]);

	if (!calculateRecursiveTotal) return null;

	return (
		<div>
			{data.subProcesses.length > 0 ? (
				<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full space-y-2">
					<div className="flex w-full items-center space-x-4 border">
						<div className="flex w-full justify-between">
							<div className="flex w-1/2 items-center space-x-0.5">
								<CollapsibleTrigger asChild>
									<button
										className={clsx(`mx-2 h-fit w-fit`, {
											'rotate-180': isOpen,
											'rotate-90': !isOpen,
										})}
									>
										<Triangle size={16} fill="#333333" />
									</button>
								</CollapsibleTrigger>
								<div className="max-w-[400px] text-sm font-semibold">{calculateRecursiveTotal.name}</div>
							</div>
							<ValueContribute value={calculateRecursiveTotal.value} percentage={calculateRecursiveTotal.percentage} />
						</div>
					</div>
					<CollapsibleContent className="space-y-2" style={{ paddingLeft: depth * 10 }}>
						{data.subProcesses.map((item, index) => (
							<TreeView key={index} depth={depth + 1} data={item} />
						))}
					</CollapsibleContent>
				</Collapsible>
			) : (
				<div className="flex justify-between text-sm font-light" style={{ paddingLeft: depth * 4 }}>
					<div className="flex max-w-[400px] items-center space-x-1">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'#000000'} fill={'none'}>
							<path
								d="M4 3V5.07692C4 7.07786 4 8.07833 4.14533 8.91545C4.94529 13.5235 8.90656 17.1376 13.9574 17.8674C14.8749 18 16.8068 18 19 18"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M17 21C17.6068 20.4102 20 18.8403 20 18C20 17.1597 17.6068 15.5898 17 15"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span>{calculateRecursiveTotal.name}</span>
					</div>
					<ValueContribute value={calculateRecursiveTotal.value} percentage={calculateRecursiveTotal.percentage} />
				</div>
			)}
		</div>
	);
};

// Main component
export default function ContributionBreakdownView({ data }: { data: TransformContributor }) {
	const {
		playgroundState: { impactCategory },
	} = useContext(PlaygroundContext);

	return (
		<div className="h-[500px] w-[700px] overflow-scroll">
			<div className="sticky left-0 right-0 top-0 flex items-center space-x-2 bg-white p-4">
				<ContributeResult w={18} h={18} one="#fb923c" two="#fdba74" />
				<span className="text-base font-semibold">Unit contribution analysis</span>
				<Info size={17} fill="#aeaeae" color="#fff" />
			</div>
			<div className="px-3 pt-2">
				<div className="mb-2 grid grid-cols-12 text-[13px] font-semibold text-[#aeaeae]">
					<div className="col-span-5 text-center">Process</div>
					<div className="col-span-4 text-center">Unit ({impactCategory?.midpointImpactCategory.unit.name})</div>
					<div className="col-span-3 text-center">Percentage Contribution</div>
				</div>
			</div>
			<div className="mt-3 px-2">
				<TreeView data={data} depth={1} />
			</div>
		</div>
	);
}
