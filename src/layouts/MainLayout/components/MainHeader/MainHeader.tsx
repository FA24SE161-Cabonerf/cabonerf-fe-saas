import MyAvatar from '@/components/Avatar/MyAvatar';
import BreadcrumbWithMenu from '@/components/BreadcrumbMenu/BreadcrumbMenu';
import { Breadcrumb, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { CheckIcon, SlashIcon } from '@radix-ui/react-icons';
import React from 'react';

export default function MainHeader() {
	return (
		<header className="p-3">
			<div className="flex items-center justify-between text-sm">
				{/* Workspace & Project */}
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbWithMenu
							dropDownTrigger={
								<React.Fragment>
									<MyAvatar fallBackContent="CN" urlAvatar="https://github.com/shadcn.png" />
									<span className="ml-1 font-medium">Personal</span>
								</React.Fragment>
							}
						>
							{
								<div className="w-[250px] rounded-sm p-[5px] text-sm">
									{/* Title */}
									<div className="mx-8 my-2 text-[11px] font-normal uppercase tracking-wider text-stone-700">
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
													className="ml-3 h-7 w-7"
													fallBackContent="CN"
													urlAvatar="https://github.com/shadcn.png"
												/>
												<span className="ml-3">Personal</span>

												{index === 0 && <CheckIcon className="absolute left-1 h-5 w-5" />}
											</div>
										))}
								</div>
							}
						</BreadcrumbWithMenu>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbWithMenu
							dropDownTrigger={
								<React.Fragment>
									<span className="ml-1 text-sm font-medium text-[#353740]">Default project</span>
								</React.Fragment>
							}
						>
							{
								<div className="w-[250px] rounded-sm p-[5px] text-sm">
									{/* Title */}
									<div className="mx-7 my-2 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
										Projects
									</div>
									{Array(3)
										.fill(0)
										.map((_, index) => (
											<div
												key={index}
												className="relative flex cursor-pointer items-center justify-start rounded-sm p-1 pl-4 font-medium transition-all duration-200 hover:bg-stone-200"
											>
												<span className="ml-3">Personal</span>
												{index === 0 && <CheckIcon className="absolute left-1 h-5 w-5" />}
											</div>
										))}
								</div>
							}
						</BreadcrumbWithMenu>
					</BreadcrumbList>
				</Breadcrumb>
				{/* Profile */}
				<div>123</div>
			</div>
		</header>
	);
}
