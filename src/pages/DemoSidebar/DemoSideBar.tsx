import logo from '@/assets/logos/long-logo.png';
import { SidebarContext } from '@/contexts/sidebar.context';
import { TrackNextIcon, TrackPreviousIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

type tProps = {
	children: React.ReactNode;
};

export default function DemoSideBar({ children }: tProps) {
	const [expanded, setExpanded] = useState<boolean>(false);

	return (
		<div className="flex">
			<aside className="h-screen">
				<nav className="bg-backgroundBehide flex h-full flex-col border-r shadow-sm">
					<div className="flex items-center justify-between p-4 pb-2">
						<img src={logo} className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`} />
						<button
							onClick={() => setExpanded((curr) => !curr)}
							className="rounded-lg bg-gray-50 p-1.5 hover:bg-gray-100"
						>
							{expanded ? <TrackNextIcon /> : <TrackPreviousIcon />}
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
