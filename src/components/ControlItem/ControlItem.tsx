import React from 'react';

type Props = {
	onAction: ({ duration }: { duration: number }) => void;
	children: React.ReactNode;
	duration: number;
};

function ControlItem({ children, onAction, duration }: Props) {
	console.log('Control Items');
	return (
		<button
			className="rounded-md border-[2px] border-gray-100 bg-white p-1.5"
			onClick={() => onAction({ duration })}
		>
			{children}
		</button>
	);
}

export default ControlItem;
