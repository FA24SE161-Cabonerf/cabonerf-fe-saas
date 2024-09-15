import Sidebar from '@/components/Sidebar';
import SidebarItem from '@/components/SidebarItem';
import MainHeader from '@/layouts/MainLayout/components/MainHeader';
import { BriefcaseBusiness } from 'lucide-react';

type tProps = {
	children: React.ReactNode;
};

export default function MainLayout({ children }: tProps) {
	return (
		<div className="flex h-screen">
			{/* Header */}
			<MainHeader />
			{/* Main */}
			<div className="mt-[54px] flex-1 overflow-hidden">
				<div className="flex">
					<Sidebar>
						<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" active />

						<hr className="my-3" />
					</Sidebar>
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
}
