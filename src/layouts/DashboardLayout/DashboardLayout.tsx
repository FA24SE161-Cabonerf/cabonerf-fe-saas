import Sidebar from '@/components/Sidebar';
import SidebarItem from '@/components/SidebarItem';
import CommonLayout from '@/layouts/CommonLayout';
import { BriefcaseBusiness } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
	return (
		<CommonLayout
			sidebar={
				<Sidebar>
					<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" active />
					<hr className="my-3" />
					<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
					<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />

					<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
					<SidebarItem icon={<BriefcaseBusiness size={19} />} text="Projects" />
				</Sidebar>
			}
			content={<Outlet />}
		/>
	);
}
