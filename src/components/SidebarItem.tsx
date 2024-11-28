import { SidebarContext } from '@/contexts/sidebar.context';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

type tProps = {
	icon: React.ReactNode;
	active?: boolean;
	text: string;
	to: string;
};

function SidebarItem({ icon, active, to, text }: tProps) {
	const { expanded } = useContext(SidebarContext);

	return (
		<Link to={to}>
			<li
				className={`group relative my-1 flex cursor-pointer items-center rounded-sm px-3 py-[8px] font-medium transition-colors ${
					active ? 'bg-[#e3e3ea] text-black' : 'text-[#6e6e7f] hover:bg-[#ececef]'
				}`}
			>
				{icon}
				<span
					className={`overflow-hidden text-ellipsis whitespace-nowrap text-sm transition-all duration-300 ${expanded ? 'ml-3 w-44' : 'w-0'} ${active ? 'font-medium' : 'font-normal'}`}
				>
					{text}
				</span>

				{!expanded && (
					<div
						className={`invisible absolute left-full z-50 ml-2 w-auto -translate-x-3 whitespace-nowrap rounded-sm bg-[#565868] px-2 py-1.5 text-sm font-normal text-white opacity-20 shadow-md transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
					>
						{text}
					</div>
				)}
			</li>
		</Link>
	);
}

export default React.memo(SidebarItem);
