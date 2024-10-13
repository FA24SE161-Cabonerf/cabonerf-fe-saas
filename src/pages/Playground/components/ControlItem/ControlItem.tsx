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
			className={clsx(`flex items-center rounded-sm p-2 transition duration-300 hover:bg-zinc-100`, {
				'bg-zinc-100': isActive,
			})}
		>
			{children}
		</button>
	);
}

export default React.memo(ControlItem);
