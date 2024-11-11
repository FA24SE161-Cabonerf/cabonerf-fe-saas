import { ToolboxDispatchType } from '@/@types/dispatch.type';
import { Skeleton } from '@/components/ui/skeleton';
import { ToolboxContext } from '@/pages/Playground/components/PlaygroundToolBoxV2/context/toolbox.context';
import clsx from 'clsx';
import React, { useCallback, useContext, useEffect, useRef } from 'react';

type Props = {
	id?: string;
	iconRenderProps: (isActive: boolean) => JSX.Element;
};

function ToolboxTrigger({ id, iconRenderProps }: Props) {
	const { app, dispatch } = useContext(ToolboxContext);
	const buttonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (id) {
			dispatch({ type: ToolboxDispatchType.ADD_TRIGGER_ID, payload: id });
		}
		return () => {
			dispatch({ type: ToolboxDispatchType.CLEAR_TRIGGER_IDS });
		};
	}, [dispatch, id]);

	const isClickOutsideTriggerMenu = useCallback(
		(event: MouseEvent) => {
			if (!app.selectedTriggerId || !app.idsMenu) return true;

			const triggerMenu = app.idsMenu.find((item) => item.id === app.selectedTriggerId);
			return (
				buttonRef.current &&
				!buttonRef.current.contains(event.target as Node) &&
				(!triggerMenu || !triggerMenu.current.contains(event.target as Node))
			);
		},
		[app]
	);

	const handleClearSelectedTriggerId = useCallback(
		(event: MouseEvent) => {
			if (isClickOutsideTriggerMenu(event)) {
				dispatch({ type: ToolboxDispatchType.CLEAR_SELECTED_TRIGGER_ID });
			}
		},
		[dispatch, isClickOutsideTriggerMenu]
	);

	useEffect(() => {
		document.addEventListener('click', handleClearSelectedTriggerId);
		return () => {
			document.removeEventListener('click', handleClearSelectedTriggerId);
		};
	}, [handleClearSelectedTriggerId]);

	const selectTriggerId = useCallback(
		(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			event.stopPropagation();
			if (id) {
				dispatch({ type: ToolboxDispatchType.SELECTED_TRIGGER_ID, payload: id });
			}
		},
		[dispatch, id]
	);

	return (
		<>
			{app.isLoading ? (
				<Skeleton className="h-[44px] w-[44px] rounded-lg" />
			) : (
				<button
					className={clsx(`items-cente flex rounded-sm p-2.5 transition duration-100`, {
						'bg-[#16a34a]': id && app.selectedTriggerId === id,
						'hover:bg-zinc-100': app.selectedTriggerId !== id,
					})}
					ref={buttonRef}
					onClick={selectTriggerId}
				>
					{iconRenderProps(app.selectedTriggerId === id)}
				</button>
			)}
		</>
	);
}

export default React.memo(ToolboxTrigger);
