import { OrganizeApis } from '@/apis/organiza.apis';
import ErrorSooner from '@/components/ErrorSooner';
import MyAvatar from '@/components/MyAvatar';
import SuccessSooner from '@/components/SuccessSooner';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import OrganizationHeader from '@/pages/Organization/components/OrganizationHeader';
import { isBadRequestError } from '@/utils/error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function OrganizationPage() {
	const [email, setEmail] = useState<string>('');
	const { organizationId } = useParams<{ organizationId: string }>();
	const {
		app: { userProfile },
	} = useContext(AppContext);

	console.log(userProfile?.role.id);
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

	const deleteMember = useMutation({
		mutationFn: (payload: { id: string }) => OrganizeApis.prototype.removeMember(payload),
	});

	const inviteMem = useMutation({
		mutationFn: (payload: { email: string; organizationId: string }) => OrganizeApis.prototype.inviteMem(payload),
	});

	useEffect(() => {
		document.title = 'Organization settings - Cabonerf';
	}, []);

	const handleDeleteMember = (id: string) => {
		deleteMember.mutate(
			{ id: id },
			{
				onSuccess: () => {
					toast(<SuccessSooner message="Remove success" />, {
						className: 'rounded-2xl p-2 w-[350px]',
						style: {
							border: `1px solid #dedede`,
							backgroundColor: `#fff`,
						},
					});
					organizationMemberQuery.refetch();
				},
				onError: (error) => {
					if (isBadRequestError<{ data: null; message: string; status: string }>(error)) {
						toast(<ErrorSooner message={error.response?.data.message as string} />, {
							className: 'rounded-2xl p-2 w-[350px]',
							style: {
								border: `1px solid #dedede`,
								backgroundColor: `#fff`,
							},
						});
					}
				},
			}
		);
	};

	const handleOnClose = (bool: boolean) => {
		if (bool === false) {
			setEmail('');
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (email !== '') {
			inviteMem.mutate(
				{ email: email, organizationId: organizationId as string },
				{
					onSuccess: () => {
						toast(<SuccessSooner message="Invite success" />, {
							className: 'rounded-2xl p-2 w-[350px]',
							style: {
								border: `1px solid #dedede`,
								backgroundColor: `#fff`,
							},
						});
						organizationMemberQuery.refetch();
					},
					onError: (error) => {
						if (isBadRequestError<{ data: null; message: string; status: string }>(error)) {
							toast(<ErrorSooner message={error.response?.data.message as string} />, {
								className: 'rounded-2xl p-2 w-[350px]',
								style: {
									border: `1px solid #dedede`,
									backgroundColor: `#fff`,
								},
							});
						}
					},
				}
			);
		}
	};

	const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	};

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

						<div className="mt-2 w-1/2 cursor-not-allowed rounded-md border bg-[#f7f7f8] px-3 py-[6px] text-sm text-[#71717A] shadow-sm">
							{organizationQuery.data?.data.data.name}
						</div>
					</div>

					<div className="mt-5">
						<div className="text-sm font-medium">Organization description</div>
						<div className="mt-1 text-xs text-[#71717A]">The name associated with this organization</div>

						<div className="mt-2 w-1/2 cursor-not-allowed rounded-md border bg-[#f7f7f8] px-3 py-[6px] text-sm text-[#71717A] shadow-sm">
							{organizationQuery.data?.data.data.description ?? 'Nothing'}
						</div>
					</div>
					<div className="mt-5">
						<div className="text-sm font-medium">Organization industry</div>
						<div className="mt-1 text-xs text-[#71717A]">All industries associated with this organization</div>

						<div className="mt-2 grid w-[70%] grid-cols-12 overflow-hidden rounded-lg border">
							{/* Header */}
							<div className="col-span-full grid grid-cols-12 rounded-t-lg bg-gray-100 px-4 py-2">
								<div className="col-span-1 text-left text-[13px] font-bold text-gray-700">No</div>
								<div className="col-span-7 text-center text-[13px] font-bold text-gray-700">Industry Name</div>
								<div className="col-span-4 text-center text-[13px] font-bold text-gray-700">Name</div>
							</div>

							{/* Rows */}
							{organizationQuery.data?.data.data.industryCodes.length === 0 ? (
								<div className="col-span-full items-center border-b bg-white px-4 py-2 text-center text-xs last:border-none hover:bg-gray-50">
									No data founded
								</div>
							) : (
								organizationQuery.data?.data.data.industryCodes.map((item, index) => (
									<div
										key={item.code}
										className="col-span-full grid grid-cols-12 items-center border-b bg-white px-4 py-2 last:border-none hover:bg-gray-50"
									>
										<div className="col-span-1 text-[12px] font-medium text-gray-800">{index + 1}</div>
										<div className="col-span-7 text-[12px] text-gray-800">{item.name}</div>
										<div className="col-span-4 text-center text-[12px] text-gray-800">{item.code}</div>
									</div>
								))
							)}
						</div>
					</div>
					<div className="mt-5">
						<div className="space-y-4">
							<div className="flex items-end justify-between">
								<div>
									<div className="text-sm font-medium">Organization member</div>
									<div className="mt-1 text-xs text-[#71717A]">Members inside this organization</div>
								</div>
							</div>
							<div className="min-h-[400px] rounded-xl border">
								{organizationMemberQuery.data?.data.data.map((item) => (
									<React.Fragment key={item.id}>
										<div className="flex items-center border-b px-5 py-3">
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
												{item.role.id !== '323e4567-e89b-12d3-a456-426614174002' && (
													<Button
														onClick={() => handleDeleteMember(item.id)}
														className="h-fit w-fit rounded-[4px] px-2 py-1 text-xs"
														variant="destructive"
													>
														Remove
													</Button>
												)}
												{item.role.id === '323e4567-e89b-12d3-a456-426614174002' && (
													<Popover onOpenChange={handleOnClose}>
														<PopoverTrigger asChild>
															<Button className="flex h-fit w-fit items-center justify-between space-x-2 rounded-sm px-1.5 py-1">
																<Plus size={15} strokeWidth={2.5} />
																<span>Invite</span>
															</Button>
														</PopoverTrigger>
														<PopoverContent asChild>
															<form className="flex justify-between" onSubmit={handleSubmit}>
																<input
																	type="email"
																	value={email}
																	onChange={handleChangeEmail}
																	className="rounded border placeholder:px-2 placeholder:text-xs"
																	placeholder="Type email"
																/>
																<Button type="submit" className="h-fit w-fit px-2 py-1">
																	Send
																</Button>
															</form>
														</PopoverContent>
													</Popover>
												)}
											</div>
										</div>
									</React.Fragment>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</motion.div>
	);
}
