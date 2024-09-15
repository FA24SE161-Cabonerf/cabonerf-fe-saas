import { SidebarContext } from '@/contexts/sidebar.context';
import React, { useContext } from 'react';

type tProps = {
	icon: React.ReactNode;
	active?: boolean;
	text: string;
};

export default function SidebarItem({ icon, active, text }: tProps) {
	const { expanded } = useContext(SidebarContext);

	return (
		<li
			className={`group relative my-1 flex cursor-pointer items-center rounded-sm px-3 py-1.5 font-medium transition-colors ${
				active ? 'bg-zinc-200 text-black' : 'text-gray-600 hover:bg-gray-200'
			}`}
		>
			{icon}
			<span
				className={`overflow-hidden text-sm transition-all duration-300 ${expanded ? 'ml-3 w-40' : 'w-0'} ${
					active ? 'font-medium' : 'font-normal'
				}`}
			>
				{text}
			</span>

			{!expanded && (
				<div
					className={`invisible absolute left-full ml-6 -translate-x-3 rounded-md bg-black px-2 py-1 text-sm font-normal text-white opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
				>
					{text}
				</div>
			)}
		</li>
	);
}
