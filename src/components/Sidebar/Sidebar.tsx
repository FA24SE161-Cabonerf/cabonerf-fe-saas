import { SidebarContext } from '@/contexts/sidebar.context';
import { PanelLeft } from 'lucide-react';
import { useState } from 'react';

type tProps = {
	children: React.ReactNode;
};

export default function Sidebar({ children }: tProps) {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="flex">
			<aside className="">
				<nav className="bg-backgroundBehide flex h-full flex-col">
					<div className="flex items-center justify-start p-3 pb-3">
						<button
							onClick={() => setExpanded((curr) => !curr)}
							className="flex w-full items-center justify-start rounded-sm px-3 py-[7px] transition-all duration-200 hover:bg-gray-200"
						>
							{expanded ? <PanelLeft size={19} /> : <PanelLeft size={19} />}
							<span
								className={`overflow-hidden text-start text-[11px] font-medium uppercase tracking-widest transition-all duration-300 ${expanded ? 'ml-3 w-40' : 'w-0'}`}
							>
								Overview
							</span>
						</button>
					</div>

					<SidebarContext.Provider value={{ expanded }}>
						<ul className="flex-1 px-3">{children}</ul>
					</SidebarContext.Provider>
				</nav>
			</aside>
		</div>
	);
}
