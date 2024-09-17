import Sidebar from '@/components/Sidebar';
import SidebarItem from '@/components/SidebarItem';
import MainHeader from '@/layouts/MainLayout/components/MainHeader';
import { BriefcaseBusiness } from 'lucide-react';

type tProps = {
	children: React.ReactNode;
};

export default function MainLayout({ children }: tProps) {
	return (
		<div className="flex h-screen bg-backgroundBehide">
			{/* Header */}
			<MainHeader /> {/*fixed left-0 right-0 top-0 p-3*/}
			{/* Main */}
			<div className="mt-[54px] h-[calc(100vh-54px)] flex-1">
				<div className="flex h-full overflow-hidden pb-2 pr-2">
					{/* Sidebar */}
					<Sidebar>
						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" active />
						<hr className="my-3" />
						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />

						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
					</Sidebar>

					{/* Main content */}
					<div className="h-full w-full overflow-scroll rounded-[8px] border-[1px] border-gray-200 bg-white">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
