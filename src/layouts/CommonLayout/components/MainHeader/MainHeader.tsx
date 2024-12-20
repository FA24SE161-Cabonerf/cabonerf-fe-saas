import { eDispatchType } from '@/@types/dispatch.type';
import { OrganizeApis } from '@/apis/organiza.apis';
import BreadcrumbWithMenu from '@/components/BreadcrumbMenu';
import MyAvatar from '@/components/MyAvatar';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { AppContext } from '@/contexts/app.context';
import ProfileDropdown from '@/layouts/CommonLayout/components/ProfileDropdown';
import { saveCurrentOrganizationToLocalStorage } from '@/utils/local_storage';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
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
		navigate(`/${extractSegment(pathname)}/${payload.orgId}`);
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
					<div className="flex items-center space-x-2"></div>

					<ProfileDropdown />
				</div>
			</div>
		</header>
	);
}
