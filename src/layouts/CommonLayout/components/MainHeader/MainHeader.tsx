import MyAvatar from '@/components/Avatar/MyAvatar';
import BreadcrumbWithMenu from '@/components/BreadcrumbMenu/BreadcrumbMenu';
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { AppContext } from '@/contexts/app.context';
import ProfileDropdown from '@/layouts/CommonLayout/components/ProfileDropdown';
import { CheckIcon, SlashIcon } from '@radix-ui/react-icons';
import { BriefcaseBusiness, Building2, Plus, Settings } from 'lucide-react';
import React, { useContext } from 'react';

export default function MainHeader() {
	const {
		app: { userProfile },
	} = useContext(AppContext);

	return (
		<header className="fixed left-0 right-0 top-0 bg-backgroundBehide p-3">
			<div className="flex items-center justify-between text-sm">
				{/* Workspace & Project */}
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbWithMenu
							dropDownTrigger={
								<React.Fragment>
									<MyAvatar fallBackContent="CN" urlAvatar="https://github.com/shadcn.png" />
									<span className="ml-1 font-medium text-foreground">Personal</span>
								</React.Fragment>
							}
						>
							{
								<div className="w-[250px] rounded-sm p-[5px] text-sm">
									{/* Title */}
									<div className="mx-8 my-2 text-[11px] font-medium uppercase tracking-widest">
										Workspaces
									</div>
									{Array(3)
										.fill(0)
										.map((_, index) => (
											<div
												key={index}
												className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-medium transition-all duration-200 hover:bg-stone-200"
											>
												<MyAvatar
													className="ml-3 h-6 w-6"
													fallBackContent="CN"
													urlAvatar="https://github.com/shadcn.png"
												/>
												<span className="ml-3">Personal</span>

												{index === 0 && <CheckIcon className="absolute left-1 h-5 w-5" />}
											</div>
										))}
									<hr className="my-1" />
									<div className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-light transition-all duration-200 hover:bg-stone-200">
										<span className="ml-4">Create organization</span>
										<Plus size={17} className="absolute left-1.5" />
									</div>
									<div className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-light transition-all duration-200 hover:bg-stone-200">
										<span className="ml-4">Organization overview</span>
										<Building2 size={17} className="absolute left-1.5" />
									</div>
								</div>
							}
						</BreadcrumbWithMenu>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbWithMenu
							dropDownTrigger={
								<React.Fragment>
									<span className="py-[2px] text-sm font-medium text-foreground">
										Default project
									</span>
								</React.Fragment>
							}
						>
							{
								<div className="w-[250px] rounded-sm p-[5px] text-sm">
									{/* Title */}
									<div className="mx-7 my-2 text-[11px] font-medium uppercase tracking-widest text-stone-500">
										Projects
									</div>
									{Array(3)
										.fill(0)
										.map((_, index) => (
											<div
												key={index}
												className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-light transition-all duration-200 hover:bg-stone-200"
											>
												<span className="ml-3">Project {index}</span>
												{index === 0 && <CheckIcon className="absolute left-1 h-5 w-5" />}
											</div>
										))}
									<hr className="my-1" />
									<div className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-light transition-all duration-200 hover:bg-stone-200">
										<span className="ml-3">Create project</span>
										<Plus size={17} className="absolute left-1.5" />
									</div>
									<div className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-light transition-all duration-200 hover:bg-stone-200">
										<span className="ml-3">Project overview</span>
										<BriefcaseBusiness size={17} className="absolute left-1.5" />
									</div>
								</div>
							}
						</BreadcrumbWithMenu>
					</BreadcrumbList>
				</Breadcrumb>
				{/* Profile */}
				<div className="flex items-center justify-end">
					<Settings className="mr-4" size={19} />
					<ProfileDropdown />
				</div>
			</div>
		</header>
	);
}
