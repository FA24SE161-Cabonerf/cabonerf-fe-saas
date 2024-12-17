import { createSwapy, Swapy } from '@/swapy/index';
import React, { useEffect, useRef } from 'react';

const CompareProcess = React.forwardRef(() => {
	// Swapy
	const swapyRef = useRef<Swapy | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// ref
	const firstCalculateRef = useRef<HTMLDivElement>(null);
	const secondCalculateRef = useRef<HTMLDivElement>(null);

	// Swapy usage
	useEffect(() => {
		if (containerRef.current) {
			swapyRef.current = createSwapy(containerRef.current, {
				animation: 'spring',
				swapMode: 'hover',
				manualSwap: false,
				dragAxis: 'both',
			});

			swapyRef.current.onBeforeSwap((event) => {
				const [from_slot_key, from_proj_id] = event.fromSlot.split('.');
				const [to_slot_key, to_proj_id, to_life_stage] = event.toSlot.split('.');
				const [, , drag_life_stage] = event.draggingItem.split('.');

				// Kiểm tra di chuyển từ ITEM_SLOT -> CALCULATE_SLOT
				if (from_slot_key === 'ITEM_SLOT' && to_slot_key === 'CALCULATE_SLOT' && from_proj_id === to_proj_id) {
					return true;
				}

				// Kiểm tra di chuyển ngược lại từ CALCULATE_SLOT -> ITEM_SLOT
				else if (
					from_slot_key === 'CALCULATE_SLOT' &&
					to_slot_key === 'ITEM_SLOT' &&
					from_proj_id === to_proj_id &&
					drag_life_stage === to_life_stage
				) {
					return true;
				}

				// Kiểm tra di chuyển trong ITEM_SLOT -> ITEM_SLOT
				else if (
					from_slot_key === 'ITEM_SLOT' &&
					to_slot_key === 'ITEM_SLOT' &&
					from_proj_id === to_proj_id &&
					drag_life_stage === to_life_stage
				) {
					return true;
				}

				return false; // Ngăn swap
			});

			swapyRef.current.slotItemMap();

			swapyRef.current.onSwapEnd((event) => {
				if (event.hasChanged === false && firstCalculateRef.current) {
					firstCalculateRef.current.classList.add('before-drag-here'); // Thêm lại class
				}

				if (event.slotItemMap.asMap.has('CALCULATE_SLOT.project-1') && firstCalculateRef.current) {
					const value = event.slotItemMap.asMap.get('CALCULATE_SLOT.project-1');
					if (value === '') {
						firstCalculateRef.current.classList.add('before-drag-here');
					} else {
						firstCalculateRef.current.classList.remove('before-drag-here');
					}
				}

				if (event.slotItemMap.asMap.has('CALCULATE_SLOT.project-2') && secondCalculateRef.current) {
					const value = event.slotItemMap.asMap.get('CALCULATE_SLOT.project-2');
					if (value === '') {
						secondCalculateRef.current.classList.add('before-drag-here');
					} else {
						secondCalculateRef.current.classList.remove('before-drag-here');
					}
				}
			});
		}

		return () => {
			swapyRef.current?.destroy();
		};
	}, []);

	return (
		<div className="container-swapy select-none" ref={containerRef}>
			<div className="flex h-[100px] space-x-2">
				<div
					ref={firstCalculateRef}
					className="before-drag-here relative h-full w-1/2 rounded-xl border"
					data-swapy-slot="CALCULATE_SLOT.project-1"
				></div>
				<div
					ref={secondCalculateRef}
					className="before-drag-here relative h-full w-1/2 rounded-xl border"
					data-swapy-slot="CALCULATE_SLOT.project-2"
				></div>
			</div>
			<div className="flex justify-between">
				<div className="flex flex-col space-y-2">
					Raw
					{Array(3)
						.fill(0)
						.map((_, index) => (
							<div
								key={index}
								className="handle-drag h-[50px] w-[300px] rounded-xl bg-gray-300"
								data-swapy-slot={`ITEM_SLOT.project-1.raw.${index}`}
							>
								<div className="h-full rounded-md border bg-white" data-swapy-item={`DRAGGING_ITEM.project-1.raw.${index}`}>
									<div>project-1:{index}</div>
								</div>
							</div>
						))}
				</div>
				<div className="flex flex-col space-y-2">
					Raw
					{Array(2)
						.fill(0)
						.map((_, index) => (
							<div
								key={index}
								className="handle-drag h-[50px] w-[300px] rounded-xl"
								data-swapy-slot={`ITEM_SLOT.project-2.raw.${index}`}
							>
								<div className="h-full rounded-md border" data-swapy-item={`DRAGGING_ITEM.project-2.raw.${index}`}>
									<div>project-2:{index}</div>
								</div>
							</div>
						))}
					Prod
					{Array(2)
						.fill(0)
						.map((_, index) => (
							<div
								key={index}
								className="handle-drag h-[50px] w-[300px] rounded-xl"
								data-swapy-slot={`ITEM_SLOT.project-2.prod.1${index}`}
							>
								<div className="h-full rounded-md border" data-swapy-item={`DRAGGING_ITEM.project-2.prod.1${index}`}>
									<div>project-2:1{index}</div>
								</div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
});

export default React.memo(CompareProcess);
