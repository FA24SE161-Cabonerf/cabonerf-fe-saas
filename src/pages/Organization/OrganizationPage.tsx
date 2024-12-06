import { OrganizeApis } from '@/apis/organiza.apis';
import MyAvatar from '@/components/MyAvatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import OrganizationHeader from '@/pages/Organization/components/OrganizationHeader';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function OrganizationPage() {
	const { organizationId } = useParams<{ organizationId: string }>();
	const {
		app: { userProfile },
	} = useContext(AppContext);

	const organizationQuery = useQuery({
		queryKey: ['organization', organizationId],
		queryFn: ({ queryKey }) => OrganizeApis.prototype.getOrganizationById({ orgId: queryKey[1] as string }),
		enabled: organizationId !== undefined,
	});

	const organizationMemberQuery = useQuery({
		queryKey: ['organization-member', organizationId],
		queryFn: ({ queryKey }) => OrganizeApis.prototype.getMemberOrganizationById({ orgId: queryKey[1] as string }),
		enabled: organizationId !== undefined,
	});

	useEffect(() => {
		document.title = 'Organization settings - Cabonerf';
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-auto flex-col ease-in"
		>
			<OrganizationHeader />
			<Separator className="shadow-sm" />

			{organizationQuery.isFetching || organizationMemberQuery.isFetching ? (
				<div className="mx-auto mt-10 h-[500px] w-1/2 animate-pulse">
					<div className="h-4 w-24 rounded bg-gray-300 text-base font-medium"></div>
					<div className="mt-5">
						<div className="h-4 w-32 rounded bg-gray-300 text-sm font-medium"></div>
						<div className="mt-1 h-3 w-56 rounded bg-gray-200 text-xs"></div>

						<div className="mt-2 w-1/2 rounded-md border bg-gray-100 px-3 py-[6px] text-sm">
							<div className="h-5 w-full rounded bg-gray-300"></div>
						</div>
					</div>

					<div className="mt-5">
						<div className="h-4 w-48 rounded bg-gray-300 text-sm font-medium"></div>
						<div className="mt-1 h-3 w-56 rounded bg-gray-200 text-xs"></div>

						<div className="mt-2 w-1/2 rounded-md border bg-gray-100 px-3 py-[6px] text-sm">
							<div className="h-5 w-full rounded bg-gray-300"></div>
						</div>
					</div>

					<div className="mt-5">
						<div className="h-4 w-48 rounded bg-gray-300 text-sm font-medium"></div>
						<div className="mt-1 h-3 w-56 rounded bg-gray-200 text-xs"></div>

						<div className="space-y-2">
							<div className="flex justify-end">
								<div className="flex h-fit w-fit items-center justify-between space-x-2 rounded-md bg-gray-300 px-4 py-2"></div>
							</div>
							<div className="min-h-[400px] rounded-xl border bg-gray-100">
								<div className="flex items-center border-b px-5 py-3">
									<div className="flex w-1/2 items-center space-x-4">
										<div className="h-7 w-7 rounded-full bg-gray-300 shadow-sm"></div>
										<div>
											<div className="h-4 w-32 rounded bg-gray-300"></div>
											<div className="mt-1 h-3 w-40 rounded bg-gray-200"></div>
										</div>
									</div>
									<div className="flex w-1/2 items-center justify-between">
										<div className="h-5 w-12 rounded bg-gray-200"></div>
										<div className="h-fit w-fit rounded-sm bg-gray-300 px-4 py-2"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="mx-auto mb-5 mt-10 w-1/2">
					<div className="text-base font-medium">Details</div>
					<div className="mt-5">
						<div className="text-sm font-medium">Organization name</div>
						<div className="mt-1 text-xs text-[#71717A]">The name associated with this organization</div>

						<div className="mt-2 w-1/2 rounded-md border bg-[#f7f7f8] px-3 py-[6px] text-sm text-[#71717A] shadow-sm">
							{organizationQuery.data?.data.data.name}
						</div>
					</div>

					<div className="mt-5">
						<div className="text-sm font-medium">Organization description</div>
						<div className="mt-1 text-xs text-[#71717A]">The name associated with this organization</div>

						<div className="mt-2 w-1/2 rounded-md border bg-[#f7f7f8] px-3 py-[6px] text-sm text-[#71717A] shadow-sm">
							{organizationQuery.data?.data.data.description ?? 'Nothing'}
						</div>
					</div>
					<div className="mt-5">
						<div className="text-sm font-medium">Organization industry</div>
						<div className="mt-1 text-xs text-[#71717A]">All industries associated with this organization</div>

						<div className="mt-2 grid w-[60%] grid-cols-12 overflow-hidden rounded-lg border">
							{/* Header */}
							<div className="col-span-full grid grid-cols-12 rounded-t-lg bg-gray-100 px-4 py-2">
								<div className="col-span-1 text-left text-[13px] font-bold text-gray-700">No</div>
								<div className="col-span-7 text-center text-[13px] font-bold text-gray-700">Industry Name</div>
								<div className="col-span-4 text-center text-[13px] font-bold text-gray-700">Name</div>
							</div>

							{/* Rows */}
							{organizationQuery.data?.data.data.industryCodes.map((item, index) => (
								<div
									key={item.code}
									className="col-span-full grid grid-cols-12 items-center border-b bg-white px-4 py-3 last:border-none hover:bg-gray-50"
								>
									<div className="col-span-1 text-[12px] font-medium text-gray-800">{index + 1}</div>
									<div className="col-span-7 text-[12px] text-gray-800">{item.name}</div>
									<div className="col-span-4 text-center text-[12px] text-gray-800">{item.code}</div>
								</div>
							))}
						</div>
					</div>
					<div className="mt-5">
						<div className="space-y-4">
							<div className="flex items-end justify-between">
								<div>
									<div className="text-sm font-medium">Organization member</div>
									<div className="mt-1 text-xs text-[#71717A]">Members inside this organization</div>
								</div>
								<Button className="flex h-fit w-fit items-center justify-between space-x-2 rounded-sm px-1.5 py-1">
									<Plus size={15} strokeWidth={2.5} />
									<span>Invite</span>
								</Button>
							</div>
							<div className="min-h-[400px] rounded-xl border">
								{organizationMemberQuery.data?.data.data.map((item) => (
									<div className="flex items-center border-b px-5 py-3" key={item.id}>
										<div className="flex w-1/2 items-center space-x-4">
											<MyAvatar urlAvatar={item.user.profilePictureUrl} fallBackContent="CN" className="h-7 w-7 shadow-sm" />
											<div>
												<div className="text-sm text-[#353740]">
													{item.user.fullName}
													{item.user.id === userProfile?.id && (
														<span className="ml-2 rounded bg-green-300 px-1 py-[1px] text-xs text-green-700">You</span>
													)}
												</div>
												<div className="text-xs text-[#6e6e80]">{item.user.email}</div>
											</div>
										</div>
										<div className="flex w-1/2 justify-between">
											<kbd className="items-center justify-center rounded-sm bg-[#EFEFEF] px-2 py-0.5 text-xs font-medium text-gray-500 sm:flex">
												{item.role.name}
											</kbd>
											<Button
												disabled={item.role.id === `323e4567-e89b-12d3-a456-426614174002`}
												className="h-fit w-fit rounded-sm px-2 py-1"
												variant="secondary"
											>
												Leave
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
}
