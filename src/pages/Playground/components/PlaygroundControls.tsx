import { PlaygroundControlDispatch } from '@/@types/dispatch.type';
import { Impact } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import CompareResult from '@/common/icons/CompareResult';
import ContributeResult from '@/common/icons/ContributeResult';
import ImpactResult from '@/common/icons/ImpactResult';
import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import ControlItem from '@/pages/Playground/components/ControlItem';
import PlaygroundControlMenu from '@/pages/Playground/components/PlaygroundControl/PlaygroundControlMenu';
import PlaygroundControlTrigger from '@/pages/Playground/components/PlaygroundControl/PlaygroundControlTrigger';
import { PlaygroundControlContext } from '@/pages/Playground/contexts/playground-control.context';
import { transformProcesses } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { Play } from 'lucide-react';
import React, { useContext, useMemo } from 'react';
import { toast } from 'sonner';

const FIT_VIEW = 1000;
const ZOOM = 150;

type Props = {
	projectId: string;
	impacts: Impact[];
};

function PlaygroundControls({ projectId, impacts }: Props) {
	const {
		playgroundControlState: { impacts: impactStateData, contributionBreakdown },
		playgroundControlDispatch,
	} = useContext(PlaygroundControlContext);
	const reactflow = useReactFlow();

	const calculateMutate = useMutation({
		mutationFn: (payload: { projectId: string }) => ProjectApis.prototype.calculateProject(payload),
	});

	const impactsData = useMemo(() => {
		return impactStateData ?? impacts;
	}, [impactStateData, impacts]);

	const contributionBreakdownResult = useMemo(() => {
		if (contributionBreakdown) {
			return transformProcesses(contributionBreakdown);
		}
	}, [contributionBreakdown]);

	const handleCalculateProject = async () => {
		calculateMutate.mutate(
			{ projectId },
			{
				onSuccess: (data) => {
					console.log(data.contributionBreakdown);
					playgroundControlDispatch({
						type: PlaygroundControlDispatch.ADD_CALCULATED_DATA,
						payload: {
							contributionBreakdown: data.contributionBreakdown,
							impacts: data.impacts,
							processes: data.processes,
						},
					});
					toast('SUCCESS');
				},
			}
		);
	};

	return (
		<TooltipProvider delayDuration={200}>
			<div className="relative w-auto transform rounded-[15px] border-[0.5px] border-gray-50 bg-white shadow-xl duration-300">
				<div className="flex items-center space-x-2 p-1.5">
					<ControlItem duration={ZOOM} onAction={reactflow.zoomIn}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
							<path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							<path
								d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinejoin="round"
							/>
							<path
								d="M7.5 11L14.5 11M11 7.5V14.5"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</ControlItem>
					<ControlItem duration={ZOOM} onAction={reactflow.zoomOut}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
							<path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
							<path
								d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinejoin="round"
							/>
							<path d="M7.5 11H14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
						</svg>
					</ControlItem>
					<ControlItem duration={FIT_VIEW} onAction={reactflow.fitView}>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={'currentColor'} fill={'none'}>
							<path
								d="M19.4 19.4L22 22M20.7 14.85C20.7 11.6191 18.0809 9 14.85 9C11.6191 9 9 11.6191 9 14.85C9 18.0809 11.6191 20.7 14.85 20.7C18.0809 20.7 20.7 18.0809 20.7 14.85Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M19.075 19.075L22 22M12.9 14.85H14.85M14.85 14.85H16.8M14.85 14.85V12.9M14.85 14.85V16.8M20.7 14.85C20.7 11.6191 18.0809 9 14.85 9C11.6191 9 9 11.6191 9 14.85C9 18.0809 11.6191 20.7 14.85 20.7C18.0809 20.7 20.7 18.0809 20.7 14.85Z"
								stroke="currentColor"
								strokeWidth="1.5"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 6C2.1305 4.6645 2.4262 3.7663 3.09625 3.09625C3.7663 2.4262 4.6645 2.1305 6 2M6 22C4.6645 21.8695 3.7663 21.5738 3.09625 20.9037C2.4262 20.2337 2.1305 19.3355 2 18M22 6C21.8695 4.6645 21.5738 3.7663 20.9037 3.09625C20.2337 2.4262 19.3355 2.1305 18 2M2 10L2 14M14 2L10 2"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						</svg>
					</ControlItem>
					<Separator orientation="vertical" className="h-6" color="black" />

					{/* Impact Assessment Result */}

					<PlaygroundControlTrigger
						isOpenTooltip={impacts.length === 0}
						disabled={impacts.length === 0}
						id="1"
						className={clsx(`rounded-[9px] p-2`, {
							'cursor-not-allowed text-[#EFEFEF]': impacts.length === 0,
							'text-[#888888] hover:text-black': impacts.length > 0,
						})}
					>
						<ImpactResult />
					</PlaygroundControlTrigger>

					{/* Contributor Assessment View */}
					<PlaygroundControlTrigger
						isOpenTooltip={Boolean(contributionBreakdown) === false}
						disabled={contributionBreakdown === null ? true : false}
						id="2"
						className={clsx(`rounded-[9px] p-2`, {
							'cursor-not-allowed text-[#EFEFEF]': contributionBreakdown === null ? true : false,
							'text-[#888888] hover:text-black': contributionBreakdown === null ? false : true,
						})}
					>
						<ContributeResult />
					</PlaygroundControlTrigger>

					{/* Compare Assessment to world */}
					<PlaygroundControlTrigger
						isOpenTooltip={Boolean(contributionBreakdown) === false}
						disabled={contributionBreakdown === null ? true : false}
						id="3"
						className={clsx(`rounded-[9px] p-2`, {
							'cursor-not-allowed text-[#EFEFEF]': contributionBreakdown === null ? true : false,
							'text-[#888888] hover:text-black': contributionBreakdown === null ? false : true,
						})}
					>
						<CompareResult />
					</PlaygroundControlTrigger>

					<Separator orientation="vertical" className="h-6" color="black" />

					<button
						className={clsx(
							`flex min-w-[145px] transform items-center justify-center space-x-3 rounded-[9px] p-2 text-[13px] font-medium transition-all duration-300 active:scale-95`,
							{
								'bg-gray-300 text-white': calculateMutate.isPending,
								'bg-green-500 text-white shadow-md shadow-green-200 hover:bg-green-600/90': !calculateMutate.isPending,
							}
						)}
						disabled={calculateMutate.isPending}
						onClick={handleCalculateProject}
					>
						{calculateMutate.isPending ? (
							<>
								<ReloadIcon className="h-4 w-4 animate-spin" /> <span>Calculating...</span>
							</>
						) : (
							<>
								<Play size={16} fill="white" color="white" /> <span>Calculate LCA</span>
							</>
						)}
					</button>
				</div>

				<PlaygroundControlMenu impacts={impactsData} contributionBreakdown={contributionBreakdownResult} />
			</div>
		</TooltipProvider>
	);
}

export default React.memo(PlaygroundControls);
