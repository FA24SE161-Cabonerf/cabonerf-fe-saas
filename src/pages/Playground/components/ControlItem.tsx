import clsx from 'clsx';
import React from 'react';

type Props = {
	isActive?: boolean;
	children: React.ReactNode;
	duration?: number;
	onAction?: ({ duration }: { duration: number }) => void;
};

function ControlItem({ children, duration, onAction, isActive }: Props) {
	return (
		<button
			onClick={() => onAction && onAction({ duration: duration as number })}
			className={clsx(`rounded-[9px] p-2 text-[#888888] hover:bg-[#EFEFEF] hover:text-black`, {
				'bg-zinc-100': isActive,
			})}
		>
			{children}
		</button>
	);
}

export default React.memo(ControlItem);
