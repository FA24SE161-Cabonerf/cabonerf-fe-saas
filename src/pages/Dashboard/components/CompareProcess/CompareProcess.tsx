import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import WarningSooner from '@/components/WarningSooner';
import { createSwapy, Swapy } from '@/swapy/index';
import { updateSVGAttributes } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { toast } from 'sonner';

type Props = {
	data: {
		firstProjectId: string;
		firstProjectProcesses: CabonerfNodeData[];
		secondProjectId: string;
		secondProjectProcesses: CabonerfNodeData[];
	};
};

const CompareProcess = React.forwardRef<HTMLDivElement, Props>(({ data }, _ref) => {
	// Swapy
	const swapyRef = useRef<Swapy | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// ref
	const firstCalculateRef = useRef<HTMLDivElement>(null);
	const secondCalculateRef = useRef<HTMLDivElement>(null);

	const lifeCycleStagesQuery = useQuery({
		queryKey: ['life-cycle-stage'],
		queryFn: LifeCycleStagesApis.prototype.getAllLifeCycleStages,
		staleTime: 60_000 * 60,
	});

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
					const [, , drag_life_stage_id] = event.draggingItem.split('.');

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
					if (event.hasChanged === false && firstCalculateRef.current) {
						firstCalculateRef.current.classList.add('before-drag-here');
						firstCalculateRef.current.classList.remove('arround');
					}

					if (event.hasChanged === false && secondCalculateRef.current) {
						secondCalculateRef.current.classList.add('before-drag-here');
						secondCalculateRef.current.classList.remove('arround');
					}

					if (event.slotItemMap.asMap.has(`CALCULATE_SLOT.${data.firstProjectId}`) && firstCalculateRef.current) {
						const value = event.slotItemMap.asMap.get(`CALCULATE_SLOT.${data.firstProjectId}`);
						if (value === '') {
							firstCalculateRef.current.classList.add('before-drag-here');
						} else {
							firstCalculateRef.current.classList.remove('before-drag-here');
						}
					}

					if (event.slotItemMap.asMap.has(`CALCULATE_SLOT.${data.secondProjectId}`) && secondCalculateRef.current) {
						const value = event.slotItemMap.asMap.get(`CALCULATE_SLOT.${data.secondProjectId}`);
						if (value === '') {
							secondCalculateRef.current.classList.add('before-drag-here');
						} else {
							secondCalculateRef.current.classList.remove('before-drag-here');
						}
					}
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

				<div className="sticky top-0 h-[100px] w-[44%] gap-3">
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
					<div className="mt-3 h-[595px] rounded-md bg-stone-100 p-2">
						<div className="flex flex-col items-center justify-center">
							<div className="font-semibold">Compare on</div>
							<div className="ml-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
								Climate Change
							</div>
						</div>
						<div className="mt-3 flex items-center">
							<div className="flex w-1/2 flex-col items-center justify-center">
								<div className="text-xs font-medium">Process name</div>
								<div className="min-h-[50px] w-[60%] border-b-2"></div>
							</div>
							<div className="font-bold text-gray-700">vs</div>
							<div className="flex w-1/2 flex-col items-center justify-center">
								<div className="text-xs font-medium">Process name</div>
								<div className="min-h-[50px] w-[60%] border-b-2"></div>
							</div>
						</div>
					</div>
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
