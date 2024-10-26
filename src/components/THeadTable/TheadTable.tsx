import React from 'react';

type Props = {
	children?: React.ReactNode;
	className?: string;
	classNameContent?: string;
	onAction?: () => void;
};

export default function TheadTable({ className, children, onAction }: Props) {
	const _className = `flex space-x-1 items-center p-1 ${className} ${onAction && 'hover:bg-gray-100 rounded'} `;

	return (
		<button className={_className} onClick={onAction}>
			{children}
		</button>
	);
}
