import { eDispatchType } from '@/@types/dispatch.type';
import { OrganizeApis } from '@/apis/organiza.apis';
import BreadcrumbWithMenu from '@/components/BreadcrumbMenu';
import MyAvatar from '@/components/MyAvatar';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import ProfileDropdown from '@/layouts/CommonLayout/components/ProfileDropdown';
import { saveCurrentOrganizationToLocalStorage } from '@/utils/local_storage';
import { useQuery } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import React, { useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
function extractSegment(url: string) {
	const match = url.match(/^\/(organization|dashboard)(\/|$)/); // Matches "/organization" or "/dashboard" with or without an ID
	return match ? match[1] : null; // Return the matched segment ('organization' or 'dashboard') or null if no match
}
export default function MainHeader() {
	const { dispatch } = useContext(AppContext);
	const { organizationId } = useParams<{ organizationId: string }>();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const organizations = useQuery({
		queryKey: ['organizations'],
		queryFn: OrganizeApis.prototype.getOrganizationsByUser,
		enabled: true,
		staleTime: 60 * 1000 * 60,
	});

	const handleUpdateOrganizationId = (payload: { orgId: string; orgName: string }) => {
		dispatch({
			type: eDispatchType.UPDATE_ORGANIZATION_ID,
			payload: {
				orgId: payload.orgId,
				orgName: payload.orgName,
			},
		});
		saveCurrentOrganizationToLocalStorage({
			orgId: payload.orgId,
			orgName: payload.orgName,
		});
		navigate(`/${extractSegment(pathname)}`);
	};

	return (
		<header className="fixed left-0 right-0 top-0 bg-backgroundBehide p-2.5">
			<div className="flex items-center justify-between text-sm">
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbWithMenu
							dropDownTrigger={
								<React.Fragment>
									<MyAvatar fallBackContent="CN" urlAvatar="" />
									<span className="ml-1 font-medium text-foreground">
										Personal{' '}
										<kbd className="rounded bg-[#8888881a] px-1 text-[12px] font-medium text-[#888888]">Organization</kbd>
									</span>
								</React.Fragment>
							}
						>
							{
								<div className="w-[300px] rounded-sm p-[5px] text-sm">
									{/* Title */}
									<div className="mx-8 my-1 text-[11px] font-semibold uppercase tracking-wider text-gray-600">organizations</div>

									{organizations.data?.data.data.map((org) => (
										<button
											onClick={() => handleUpdateOrganizationId({ orgId: org.id, orgName: org.name })}
											key={org.id}
											className="relative flex w-full cursor-pointer items-center rounded-[6px] py-1 pl-8 duration-75 hover:bg-gray-200"
										>
											<MyAvatar fallBackContent="CN" urlAvatar="" />
											<span className="ml-2 font-medium">{org.name}</span>

											{organizationId === org.id && (
												<Check size={15} className="absolute left-2 top-1/2 ml-0 -translate-y-1/2" />
											)}
										</button>
									))}
								</div>
							}
						</BreadcrumbWithMenu>
					</BreadcrumbList>
				</Breadcrumb>
				{/* Profile */}
				<div className="mr-1 flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<Popover>
							<PopoverTrigger asChild className="rounded-sm p-1.5 hover:bg-[#ececef]">
								<div className="cursor-pointer">
									<Bell size={18} />
								</div>
							</PopoverTrigger>
							<PopoverContent className="m-0 mr-2 h-auto w-[350px] rounded-xl border p-0 shadow-md" asChild>
								<div className="relative">
									<div className="px-3 py-1.5 text-sm font-semibold">Notification</div>
									<Separator />
									<div className="flex flex-col space-y-2 p-2">
										{Array(5)
											.fill(0)
											.map((_, index) => (
												<div key={index} className="flex items-start space-x-2 rounded-md p-2 hover:bg-gray-100">
													<MyAvatar fallBackContent="CN" className="h-10 w-10" urlAvatar="https://github.com/shadcn.png" />
													<div className="flex flex-col space-y-2 leading-5">
														<div className="text-xs">
															You’re Invited: <b>Client B</b> has invited you to join <b>FPT</b>{' '}
															<div className="before-exchange-substance relative inline-block rounded border bg-green-50 px-[3px] before:h-[80%] before:w-[2px] before:bg-green-500">
																organization
															</div>
														</div>
														<div className="flex space-x-2">
															<Button className="h-fit rounded px-2 py-1 text-xs">Approve</Button>
															<Button className="h-fit rounded px-2 py-1 text-xs" variant={'destructive'}>
																Deny
															</Button>
														</div>
													</div>
												</div>
											))}
									</div>
								</div>
							</PopoverContent>
						</Popover>
					</div>

					<ProfileDropdown />
				</div>
			</div>
		</header>
	);
}
