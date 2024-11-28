import Sidebar from '@/components/Sidebar';
import SidebarItem from '@/components/SidebarItem';
import CommonLayout from '@/layouts/CommonLayout';
import { BriefcaseBusiness, Building2, Package, Settings } from 'lucide-react';
import { Outlet, useLocation } from 'react-router-dom';

export default function DashboardLayout() {
	const { pathname } = useLocation();

	const path = pathname.split('/')[1];

	return (
		<CommonLayout
			sidebar={
				<Sidebar>
					<SidebarItem icon={<Settings size={19} />} to="setting" text="Setting profile" active={path === 'setting'} />
					<hr className="my-3" />
					<SidebarItem icon={<Building2 size={19} />} to="organization" text="Organization" active={path === 'organization'} />
					<SidebarItem icon={<BriefcaseBusiness size={19} />} to="/" text="Projects" active={path === 'dashboard'} />
					<SidebarItem icon={<Package size={19} />} to="object-libraries" text="Object Libraries" active={path === 'object-library'} />
				</Sidebar>
			}
			content={<Outlet />}
		/>
	);
}
