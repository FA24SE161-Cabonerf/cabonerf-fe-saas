import DemoSidebarItem from '@/components/DemoSidebarItem/DemoSidebarItem';
import MainHeader from '@/layouts/MainLayout/components/MainHeader';
import DemoSideBar from '@/pages/DemoSidebar';
import { HomeIcon } from '@radix-ui/react-icons';

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
					<DemoSideBar>
						<DemoSidebarItem icon={<HomeIcon />} text="Home" alert />
						<DemoSidebarItem icon={<HomeIcon />} text="Dashboard" active />
						<DemoSidebarItem icon={<HomeIcon />} text="Projects" alert />
						<DemoSidebarItem icon={<HomeIcon />} text="Calendar" />
						<DemoSidebarItem icon={<HomeIcon />} text="Tasks" />
						<DemoSidebarItem icon={<HomeIcon />} text="Reporting" />
						<hr className="my-3" />
						<DemoSidebarItem icon={<HomeIcon />} text="Settings" />
						<DemoSidebarItem icon={<HomeIcon />} text="Help" />
					</DemoSideBar>
					<div>123</div>
				</div>
			</div>
		</div>
	);
}
