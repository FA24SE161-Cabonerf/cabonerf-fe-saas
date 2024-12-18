import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import WarningSooner from '@/components/WarningSooner';
import { createSwapy, Swapy } from '@/swapy/index';
import { updateSVGAttributes } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	data: {
		firstProjectId: string;
		firstProjectProcesses: CabonerfNodeData[];
		secondProjectId: string;
		secondProjectProcesses: CabonerfNodeData[];
	};
	baseIndex: number;
	impactCategory: Omit<ImpactCategory, 'indicator' | 'indicatorDescription' | 'unit' | 'emissionCompartment'>;
};

const compares = ['Value Difference Comparison', 'Contribution Percentage Comparison', 'Ranking Comparison', 'Emission compartment to'];

const CompareProcess = React.forwardRef<HTMLDivElement, Props>(({ data, baseIndex, impactCategory }, _ref) => {
	// Swapy
	const swapyRef = useRef<Swapy | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	//Process
	const [firstCalculateProcess, setFirstCalculateProcess] = useState<CabonerfNodeData | null>(null);
	const [secondCalculateProcess, setSecondCalculateProcess] = useState<CabonerfNodeData | null>(null);

	// ref
	const firstCalculateRef = useRef<HTMLDivElement>(null);
	const secondCalculateRef = useRef<HTMLDivElement>(null);

	const lifeCycleStagesQuery = useQuery({
		queryKey: ['life-cycle-stage'],
		queryFn: LifeCycleStagesApis.prototype.getAllLifeCycleStages,
		staleTime: 60_000 * 60,
	});

	const valueCompares = useMemo(() => {
		return compares.map((item) => {
			if (item === 'Value Difference Comparison') {
				const valueLeft =
					firstCalculateProcess?.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;

				const valueRight =
					secondCalculateProcess?.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;

				return {
					name: item,
					valueLeft,
					valueRight,
					valueCenter: impactCategory.midpointImpactCategory.unit.name,
				};
			} else if (item === 'Contribution Percentage Comparison') {
				const valueOfFirst =
					firstCalculateProcess?.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;

				const totalValueOfFirstProject =
					data.firstProjectProcesses?.reduce((curr, acc) => {
						const impact = acc.impacts.find((impact) => impact.impactCategory.id === impactCategory.id);
						return curr + (impact?.unitLevel || 0);
					}, 0) ?? 0;

				const valueOfSecond =
					secondCalculateProcess?.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;

				const totalValueOfSecondProject =
					data.secondProjectProcesses?.reduce((curr, acc) => {
						const impact = acc.impacts.find((impact) => impact.impactCategory.id === impactCategory.id);
						return curr + (impact?.unitLevel || 0);
					}, 0) ?? 0;

				const percentageValueLeft = totalValueOfFirstProject ? (valueOfFirst / totalValueOfFirstProject) * 100 : 0;
				const percentageValueRight = totalValueOfSecondProject ? (valueOfSecond / totalValueOfSecondProject) * 100 : 0;

				return {
					name: item,
					valueLeft: percentageValueLeft,
					valueRight: percentageValueRight,
					valueCenter: '%',
				};
			} else if (item === 'Ranking Comparison') {
				const allProcessesFirstProject = data.firstProjectProcesses.sort((a, b) => {
					const aImpact = a.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;
					const bImpact = b.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;
					return bImpact - aImpact;
				});

				const allProcessesSecondProject = data.secondProjectProcesses.sort((a, b) => {
					const aImpact = a.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;
					const bImpact = b.impacts.find((impact) => impact.impactCategory.id === impactCategory.id)?.unitLevel ?? 0;
					return bImpact - aImpact;
				});

				const rankLeft = allProcessesFirstProject.findIndex((process) => process.id === firstCalculateProcess?.id) + 1;

				const rankRight = allProcessesSecondProject.findIndex((process) => process.id === secondCalculateProcess?.id) + 1;

				return {
					name: item,
					valueLeft: rankLeft,
					valueRight: rankRight,
					valueCenter: baseIndex === 0 ? rankLeft - rankRight : rankRight - rankLeft,
				};
			} else {
				return {
					name: item,
					valueLeft: firstCalculateProcess?.impacts ? 'Air' : '_',
					valueRight: secondCalculateProcess?.impacts ? 'Air' : '_',
					valueCenter: '',
				};
			}
		});
	}, [
		firstCalculateProcess?.impacts,
		firstCalculateProcess?.id,
		secondCalculateProcess?.impacts,
		secondCalculateProcess?.id,
		impactCategory.midpointImpactCategory.unit.name,
		impactCategory.id,
		data.firstProjectProcesses,
		data.secondProjectProcesses,
		baseIndex,
	]);

	useEffect(() => {
		const initializeSwapy = () => {
			if (swapyRef.current) {
				swapyRef.current.destroy();
			}

			if (containerRef.current) {
				swapyRef.current = createSwapy(containerRef.current, {
					animation: 'dynamic',
					swapMode: 'hover',
					manualSwap: false,
					dragAxis: 'both',
					autoScrollOnDrag: true,
				});

				swapyRef.current.onSwapStart((event) => {
					const { asMap } = event.slotItemMap;
					const [, drag_proj_id, curr_drag_life_stage_id] = event.draggingItem.split('.');
					if (drag_proj_id === data.firstProjectId) {
						if (asMap.has(`CALCULATE_SLOT.${data.secondProjectId}`) && firstCalculateRef.current) {
							firstCalculateRef.current.classList.add('arround');
							const valueOfSecondCalSlot = asMap.get(`CALCULATE_SLOT.${data.secondProjectId}`);
							if (!valueOfSecondCalSlot) {
								return true;
							}
							const [, , drag_life_stage_id] = valueOfSecondCalSlot.split('.');
							if (curr_drag_life_stage_id !== drag_life_stage_id) {
								toast(<WarningSooner message={`Ensure the same life stage for accuracy.`} />, {
									className: 'rounded-2xl p-2 w-[350px]',
									style: {
										border: `1px solid #dedede`,
										backgroundColor: `#fff`,
									},
								});
								return false;
							}
						}
					} else {
						if (asMap.has(`CALCULATE_SLOT.${data.firstProjectId}`) && secondCalculateRef.current) {
							secondCalculateRef.current.classList.add('arround');
							const valueOfSecondCalSlot = asMap.get(`CALCULATE_SLOT.${data.firstProjectId}`);

							if (!valueOfSecondCalSlot) {
								return true;
							}
							const [, , drag_life_stage_id] = valueOfSecondCalSlot.split('.');
							if (curr_drag_life_stage_id !== drag_life_stage_id) {
								toast(<WarningSooner message={`Ensure the same life stage for accuracy.`} />, {
									className: 'rounded-2xl p-2 w-[350px]',
									style: {
										border: `1px solid #dedede`,
										backgroundColor: `#fff`,
									},
								});
								return false;
							}
						}
					}
				});

				swapyRef.current.onBeforeSwap((event) => {
					const [from_slot_key, from_proj_id] = event.fromSlot.split('.');
					const [to_slot_key, to_proj_id, to_life_stage] = event.toSlot.split('.');
					const [, drag_proj_id, drag_life_stage_id] = event.draggingItem.split('.');

					if (firstCalculateRef.current && secondCalculateRef.current) {
						if (from_slot_key === 'ITEM_SLOT' && to_slot_key === 'CALCULATE_SLOT' && from_proj_id === to_proj_id) {
							firstCalculateRef.current.classList.remove('arround');
							secondCalculateRef.current.classList.remove('arround');

							return true;
						} else if (
							from_slot_key === 'CALCULATE_SLOT' &&
							to_slot_key === 'ITEM_SLOT' &&
							from_proj_id === to_proj_id &&
							drag_life_stage_id === to_life_stage
						) {
							firstCalculateRef.current.classList.remove('arround');
							secondCalculateRef.current.classList.remove('arround');

							// eslint-disable-next-line @typescript-eslint/no-unused-expressions
							drag_proj_id === data.firstProjectId ? setFirstCalculateProcess(null) : setSecondCalculateProcess(null);

							return true;
						} else if (
							from_slot_key === 'ITEM_SLOT' &&
							to_slot_key === 'ITEM_SLOT' &&
							from_proj_id === to_proj_id &&
							drag_life_stage_id === to_life_stage
						) {
							firstCalculateRef.current.classList.remove('arround');
							secondCalculateRef.current.classList.remove('arround');
							return true;
						}
					}
					return false;
				});

				swapyRef.current.onSwapEnd((event) => {
					const { asMap } = event.slotItemMap;

					// Helper function to handle process lookup and state update
					const handleProcessUpdate = (
						projectId: string,
						processes: CabonerfNodeData[],
						setProcess: React.Dispatch<React.SetStateAction<CabonerfNodeData | null>>
					) => {
						const value = asMap.get(`CALCULATE_SLOT.${projectId}`);

						if (!value) {
							setProcess(null);
							return;
						}

						const [, , , drag_node_id] = value.split('.');
						const process = processes.find((node) => node.id === drag_node_id);
						setProcess(process || null);
					};

					// Update processes for first and second project
					if (asMap.has(`CALCULATE_SLOT.${data.firstProjectId}`)) {
						handleProcessUpdate(data.firstProjectId, data.firstProjectProcesses, setFirstCalculateProcess);
					}

					if (asMap.has(`CALCULATE_SLOT.${data.secondProjectId}`)) {
						handleProcessUpdate(data.secondProjectId, data.secondProjectProcesses, setSecondCalculateProcess);
					}

					// Handle visual feedback for dragging
					const handleVisualFeedback = (projectId: string, ref: any) => {
						const value = asMap.get(`CALCULATE_SLOT.${projectId}`);
						if (value === '' && ref.current) {
							ref.current.classList.add('before-drag-here');
						} else if (ref.current) {
							ref.current.classList.remove('before-drag-here');
						}
					};

					if (event.hasChanged === false && secondCalculateRef.current) {
						secondCalculateRef.current.classList.add('before-drag-here');
						secondCalculateRef.current.classList.remove('arround');
						setSecondCalculateProcess(null);
					}

					handleVisualFeedback(data.firstProjectId, firstCalculateRef);
					handleVisualFeedback(data.secondProjectId, secondCalculateRef);
				});
			}
		};

		// Khởi tạo Swapy
		initializeSwapy();

		return () => {
			swapyRef.current?.destroy();
		};
	}, [lifeCycleStagesQuery.data, data]);

	return (
		<div className="container-swapy select-none px-3" ref={containerRef}>
			<div className="flex w-full gap-3">
				<div className="mb-2 flex h-full max-h-full w-[28%] flex-col space-y-3">
					{lifeCycleStagesQuery.data?.data.data.map((life_stage) => (
						<div key={life_stage.id} className="rounded-md bg-stone-100 p-3">
							<div className="flex items-center space-x-2">
								<div
									className="rounded-[7px] bg-green-600 p-1.5"
									dangerouslySetInnerHTML={{
										__html: updateSVGAttributes({
											svgString: life_stage.iconUrl,
											properties: {
												color: 'white',
												fill: 'white',
												height: 15,
												width: 15,
											},
										}),
									}}
								/>
								<div className="text-sm">{life_stage.name}</div>
							</div>
							<div className="mt-3 space-y-3">
								{data.firstProjectProcesses.map((node) => {
									if (node.lifeCycleStage.id === life_stage.id) {
										return (
											<div
												key={node.id}
												className="handle-drag h-[45px] w-full rounded-md bg-stone-200"
												data-swapy-slot={`ITEM_SLOT.${data.firstProjectId}.${life_stage.id}.${node.id}`}
											>
												<div
													className="h-full rounded-md border-[0.5px] border-gray-50 bg-white shadow-md"
													data-swapy-item={`DRAGGING_ITEM.${data.firstProjectId}.${life_stage.id}.${node.id}`}
												>
													<div className="flex h-full items-center justify-center text-xs">
														<div>{node.name}</div>
													</div>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
					))}
				</div>

				<div className="w-[44%] gap-3">
					<div className="flex w-full gap-3">
						<div
							ref={firstCalculateRef}
							className="before-drag-here relative h-[100px] w-1/2 rounded-md bg-stone-100 shadow-sm"
							data-swapy-slot={`CALCULATE_SLOT.${data.firstProjectId}`}
						></div>
						<div
							ref={secondCalculateRef}
							className="before-drag-here relative h-[100px] w-1/2 rounded-md bg-stone-100 shadow-sm"
							data-swapy-slot={`CALCULATE_SLOT.${data.secondProjectId}`}
						></div>
					</div>
					<TooltipProvider>
						<div className="mb-2 mt-3 h-[600px] rounded-md bg-stone-100 p-2">
							<div className="mt-2 flex flex-col items-center justify-center">
								<div className="text-sm font-semibold text-gray-700">
									Comprehensive Comparative Analysis of Processes Across Projects
								</div>
								<div className="flex items-center space-x-1">
									<span className="text-sm font-semibold text-gray-700"> based on</span>
									<span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
										{impactCategory.name}
									</span>
								</div>
							</div>
							<div className="mt-7 flex items-center">
								<div className="flex w-1/2 flex-col items-center justify-center">
									<Tooltip>
										<div className="text-xs font-semibold text-gray-700">Process Name</div>
										<div className="relative h-[50px] w-[60%] overflow-hidden border-b border-gray-300">
											{firstCalculateProcess !== null ? (
												<>
													<TooltipTrigger id="name-1" asChild>
														<div className="absolute left-1/2 top-1/2 line-clamp-2 h-[40px] w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden break-words text-center text-sm font-medium text-gray-900">
															{firstCalculateProcess.name}
														</div>
													</TooltipTrigger>
													<TooltipContent id="name-1">{firstCalculateProcess?.name}</TooltipContent>
												</>
											) : (
												<div></div>
											)}
										</div>
									</Tooltip>
								</div>

								<div className="font-bold text-gray-600">vs</div>
								<div className="flex w-1/2 flex-col items-center justify-center">
									<Tooltip>
										<div className="text-xs font-semibold text-gray-700">Process Name</div>
										<div className="relative h-[50px] w-[60%] overflow-hidden border-b border-gray-300">
											{secondCalculateProcess !== null ? (
												<>
													<TooltipTrigger id="name-1" asChild>
														<div className="absolute left-1/2 top-1/2 line-clamp-2 h-[40px] w-full -translate-x-1/2 -translate-y-1/2 overflow-hidden break-words text-center text-sm font-medium text-gray-900">
															{secondCalculateProcess.name}
														</div>
													</TooltipTrigger>
													<TooltipContent id="name-1">{secondCalculateProcess.name}</TooltipContent>
												</>
											) : (
												<div></div>
											)}
										</div>
									</Tooltip>
								</div>
							</div>

							<div className="mt-10 flex w-full flex-col items-center space-y-10 px-5">
								{valueCompares.map((item, index) => (
									<div key={index} className="flex w-full items-center justify-between">
										<div className="min-w-[50px] text-sm">{item.valueLeft}</div>
										<div className="flex flex-col text-center text-sm font-medium">
											<div>{item.name}</div>
											<div className="text-xs text-green-700">{item.valueCenter}</div>
										</div>
										<div className="min-w-[50px] text-sm">{item.valueRight}</div>
									</div>
								))}
							</div>
						</div>
					</TooltipProvider>
				</div>

				<div className="mb-2 flex h-full max-h-full w-[28%] flex-col space-y-3">
					{lifeCycleStagesQuery.data?.data.data.map((life_stage) => (
						<div key={life_stage.id} className="rounded-md bg-stone-100 p-3">
							<div className="flex items-center space-x-2">
								<div
									className="rounded-[7px] bg-green-600 p-1.5"
									dangerouslySetInnerHTML={{
										__html: updateSVGAttributes({
											svgString: life_stage.iconUrl,
											properties: {
												color: 'white',
												fill: 'white',
												height: 15,
												width: 15,
											},
										}),
									}}
								/>
								<div className="text-sm">{life_stage.name}</div>
							</div>
							<div className="mt-3 space-y-3">
								{data.secondProjectProcesses.map((node) => {
									if (node.lifeCycleStage.id === life_stage.id) {
										return (
											<div
												key={node.id}
												className="handle-drag h-[45px] w-full rounded-md bg-stone-200"
												data-swapy-slot={`ITEM_SLOT.${data.secondProjectId}.${life_stage.id}.${node.id}`}
											>
												<div
													className="h-full rounded-md border-[0.5px] border-gray-50 bg-white shadow-md"
													data-swapy-item={`DRAGGING_ITEM.${data.secondProjectId}.${life_stage.id}.${node.id}`}
												>
													<div className="flex h-full items-center justify-center text-xs">{node.name}</div>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

export default React.memo(CompareProcess);
