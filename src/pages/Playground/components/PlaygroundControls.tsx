import { Impact } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import tutorial from '@/assets/images/tutorial.png';
import CompareResult from '@/common/icons/CompareResult';
import ContributeResult from '@/common/icons/ContributeResult';
import ImpactResult from '@/common/icons/ImpactResult';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ControlItem from '@/pages/Playground/components/ControlItem';
import { isBadRequestError } from '@/utils/error';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { isAxiosError } from 'axios';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { Play } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

const FIT_VIEW = 1000;
const ZOOM = 150;

type Props = {
	projectId: string;
	impacts: Impact[];
};

function PlaygroundControls({ projectId, impacts }: Props) {
	const reactflow = useReactFlow();

	const calculate = useQuery({
		queryKey: ['calculate'],
		queryFn: () => ProjectApis.prototype.calculateProject(projectId),
		enabled: false,
	});

	const handleCalculateProject = async () => {
		try {
			const data = await calculate.refetch();

			if (isAxiosError(data.data)) {
				throw data.data;
			} else {
				toast('SUCCESS');
			}
		} catch (error) {
			if (isBadRequestError<{ data: unknown; message: string; status: string }>(error)) {
				toast.error(error.response?.data.message);
			}
		}
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

					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger disabled={impacts.length === 0} asChild>
									<button
										className={clsx(`rounded-[9px] p-2`, {
											'cursor-not-allowed text-[#EFEFEF]': impacts.length === 0,
											'text-[#888888] hover:bg-[#EFEFEF] hover:text-black': impacts.length > 0,
										})}
									>
										<ImpactResult />
									</button>
								</PopoverTrigger>
							</TooltipTrigger>
							{impacts.length === 0 && (
								<TooltipContent className="relative mb-3 w-[200px] overflow-visible rounded-2xl border-none bg-white p-2.5 text-[#333333] shadow-sm">
									<div className="flex flex-col space-y-3">
										<img src={tutorial} className="rounded-md object-contain" />
										<div>
											<div className="mb-1 text-[12px] font-semibold">Turorial</div>
											<div className="text-[11px] text-gray-700">
												To view the results of this project, please perform the calculation.
											</div>
										</div>
										<div className="absolute -bottom-[6px] left-1/2 z-50 h-0 w-0 -translate-x-[calc(50%+7px)] border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white"></div>
									</div>
								</TooltipContent>
							)}
						</Tooltip>

						<PopoverContent asChild className="mb-2 h-[400px] w-[550px] overflow-y-scroll rounded-[15px] p-0">
							<div className="bg-white">
								{/* Title */}
								<div className="sticky left-0 right-0 top-0 bg-white py-3 text-center text-sm font-medium">
									Impact Assessment Result
								</div>
								{/* Table List */}
								<div className="grid-c flex flex-col space-y-1 px-3 py-1">
									{impacts.map((item) => (
										<div key={item.id} className="grid grid-cols-12 items-center gap-3 p-1">
											<div className="col-span-1 flex justify-center">
												<div
													dangerouslySetInnerHTML={{
														__html: DOMPurify.sanitize(
															updateSVGAttributes({
																svgString: item.impactCategory.iconUrl,
																properties: {
																	height: 25,
																	width: 25,
																	color: '#000',
																	fill: 'none',
																},
															})
														),
													}}
												/>
											</div>
											<div className="col-span-8">
												<div className="text-base font-medium">{item.impactCategory.name}</div>
												<div className="text-xs text-gray-600">
													{item.impactCategory.midpointImpactCategory.name} ({item.impactCategory.midpointImpactCategory.abbr})
												</div>
											</div>
											<div className="col-span-3 flex items-center justify-end space-x-2 text-xs">
												<div className="text-sm font-semibold">{item.value}</div>
												<div className="font-medium">{item.impactCategory.midpointImpactCategory.unit.name}</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</PopoverContent>
					</Popover>

					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<button
										className={clsx(`rounded-[9px] p-2`, {
											'cursor-not-allowed text-[#EFEFEF]': impacts.length === 0,
											'text-[#888888] hover:bg-[#EFEFEF] hover:text-black': impacts.length > 0,
										})}
									>
										<ContributeResult />
									</button>
								</PopoverTrigger>
							</TooltipTrigger>
							{impacts.length === 0 && (
								<TooltipContent className="relative mb-3 w-[200px] overflow-visible rounded-2xl border-none bg-white p-2.5 text-[#333333] shadow-sm">
									<div className="flex flex-col space-y-3">
										<img src={tutorial} className="rounded-md object-contain" />
										<div>
											<div className="mb-1 text-[12px] font-semibold">Turorial</div>
											<div className="text-[11px] text-gray-700">
												To view the results of this project, please perform the calculation.
											</div>
										</div>
										<div className="absolute -bottom-[6px] left-1/2 z-50 h-0 w-0 -translate-x-[calc(50%+7px)] border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white"></div>
									</div>
								</TooltipContent>
							)}
						</Tooltip>
					</Popover>

					<Popover>
						<Tooltip>
							<TooltipTrigger asChild>
								<PopoverTrigger asChild>
									<button
										className={clsx(`rounded-[9px] p-2`, {
											'cursor-not-allowed text-[#EFEFEF]': impacts.length === 0,
											'text-[#888888] hover:bg-[#EFEFEF] hover:text-black': impacts.length > 0,
										})}
									>
										<CompareResult />
									</button>
								</PopoverTrigger>
							</TooltipTrigger>
							{impacts.length === 0 && (
								<TooltipContent className="relative mb-3 w-[200px] overflow-visible rounded-2xl border-none bg-white p-2.5 text-[#333333] shadow-sm">
									<div className="flex flex-col space-y-3">
										<img src={tutorial} className="rounded-md object-contain" />
										<div>
											<div className="mb-1 text-[12px] font-semibold">Turorial</div>
											<div className="text-[11px] text-gray-700">
												To view the results of this project, please perform the calculation.
											</div>
										</div>
										<div className="absolute -bottom-[6px] left-1/2 z-50 h-0 w-0 -translate-x-[calc(50%+7px)] border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-white"></div>
									</div>
								</TooltipContent>
							)}
						</Tooltip>

						{/* <PopoverContent>
							<div>123</div>
						</PopoverContent> */}
					</Popover>

					<Separator orientation="vertical" className="h-6" color="black" />

					<button
						className={clsx(
							`flex min-w-[145px] transform items-center justify-center space-x-3 rounded-[9px] p-2 text-[13px] font-medium transition-all duration-300 active:scale-95`,
							{
								'bg-gray-300 text-white': calculate.isFetching,
								'bg-green-500 text-white shadow-md shadow-green-200 hover:bg-green-600/90': !calculate.isFetching,
							}
						)}
						disabled={calculate.isFetching}
						onClick={handleCalculateProject}
					>
						{calculate.isFetching ? (
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
			</div>
		</TooltipProvider>
	);
}

export default React.memo(PlaygroundControls);
