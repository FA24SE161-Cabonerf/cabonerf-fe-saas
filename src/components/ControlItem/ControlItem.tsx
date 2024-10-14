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
			className="rounded-md border-[2px] border-gray-100 bg-white p-1.5 transition duration-300 ease-in-out hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
			onClick={() => onAction({ duration })}
		>
			{children}
		</button>
	);
}

export default ControlItem;
