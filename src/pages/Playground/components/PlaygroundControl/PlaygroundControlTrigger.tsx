import React, { forwardRef, memo, useContext, useEffect } from 'react';
import { PlaygroundControlDispatch } from '@/@types/dispatch.type';
import { PlaygroundControlContext } from '@/pages/Playground/contexts/playground-control.context';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import tutorial from '@/assets/images/tutorial.png';

interface Props {
	id: string;
	children: React.ReactNode;
	isOpenTooltip?: boolean;
	className?: string;
	disabled?: boolean;
}

const PlaygroundControlTrigger = forwardRef<HTMLButtonElement, Props>(
	({ id, isOpenTooltip = false, children, className, disabled }, ref) => {
		const { playgroundControlState, playgroundControlDispatch } = useContext(PlaygroundControlContext);

		useEffect(() => {
			if (id) {
				playgroundControlDispatch({
					type: PlaygroundControlDispatch.ADD_TRIGGER_ID,
					payload: id,
				});
			}
			return () => {
				playgroundControlDispatch({
					type: PlaygroundControlDispatch.CLEAR_TRIGGER_IDS,
				});
			};
		}, [playgroundControlDispatch, id]);

		const selectTriggerId = () => {
			playgroundControlDispatch({
				type: PlaygroundControlDispatch.SELECTED_TRIGGER_ID,
				payload: playgroundControlState.selectedTriggerId === id ? null : id,
			});
		};

		return (
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							ref={ref}
							disabled={disabled}
							className={`z-50 ${className} ${playgroundControlState.selectedTriggerId === id ? 'bg-[#EFEFEF] text-black' : ''}`}
							onClick={selectTriggerId}
						>
							{children}
						</button>
					</TooltipTrigger>
					{isOpenTooltip && (
						<TooltipContent className="relative mb-3 w-[200px] overflow-visible rounded-2xl border-none bg-white p-2.5 text-[#333333] shadow">
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
			</TooltipProvider>
		);
	}
);

export default memo(PlaygroundControlTrigger);
