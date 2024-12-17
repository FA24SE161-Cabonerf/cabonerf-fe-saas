import ObjectLibraryApis from '@/apis/objectLibrary.apis';
import ErrorSooner from '@/components/ErrorSooner';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import TAB_TITLES from '@/constants/tab.titles';
import { useDebounce } from '@/hooks/useDebounce';
import ObjectLibrariesHeader from '@/pages/ObjectLibraries/components/ObjectLibrariesHeader';
import { isBadRequestError } from '@/utils/error';
import { formatWithExponential, timeAgo, updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Package, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function ObjectLibrariesPage() {
	const [textSearch, setTextSearch] = useState<string>('');
	const [listSelect, setListSelect] = useState<string[]>([]);
	const textDebounced = useDebounce({ currentValue: textSearch, delayTime: 500 });
	const params = useParams<{ organizationId: string }>();

	const { data, isLoading, isFetching, refetch } = useQuery({
		queryKey: ['object-libraries', params.organizationId, textDebounced],
		queryFn: ({ queryKey }) => {
			return ObjectLibraryApis.prototype.getListObjectLibrary({
				organizationId: queryKey[1] as string, // Use explicit typing for safety
				keyword: queryKey[2] ?? '',
				systemBoundaryId: queryKey[3] as string,
				pageCurrent: 1,
				pageSize: 18,
			});
		},
		refetchOnMount: true,
		staleTime: 0,
		placeholderData: (previousData) => previousData,
	});

	const deleteObjLibMutate = useMutation({
		mutationFn: (payload: { objectIds: string[]; orgId: string }) => ObjectLibraryApis.prototype.deleteObjectLibrary(payload),
	});

	useEffect(() => {
		document.title = `Object Libraries - ${TAB_TITLES.HOME}`;
	}, []);

	const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTextSearch(event.target.value);
	};

	const handleSelect = (id: string) => {
		setListSelect((prev) => {
			const isExist = prev.includes(id);
			if (isExist) {
				return prev.filter((item) => item !== id);
			} else {
				return [...prev, id];
			}
		});
	};

	const handleDelete = () => {
		deleteObjLibMutate.mutate(
			{ objectIds: listSelect, orgId: params.organizationId as string },
			{
				onSuccess: () => {
					refetch();
					setListSelect([]);
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

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col ease-in"
		>
			<ObjectLibrariesHeader />
			<Separator className="shadow-sm" />
			<div className="mx-6 my-6">
				{/* Search */}
				<div className="flex justify-between">
					<div className="flex w-[25%] items-center space-x-2 rounded-md border px-3 py-1">
						<Search size={15} color="#c4c4c4" />
						<input
							onChange={handleChangeSearch}
							className="w-full outline-none placeholder:text-sm placeholder:font-normal"
							placeholder="Search object libraries"
						/>
						{isFetching && <ReloadIcon className="h-4 w-4 animate-spin" />}
					</div>

					<button
						disabled={deleteObjLibMutate.isPending}
						onClick={handleDelete}
						className={clsx('flex items-center space-x-1 rounded-sm px-2 text-xs text-white shadow transition-all', {
							'cursor-not-allowed bg-gray-300': listSelect.length === 0,
							'bg-red-500 hover:bg-red-600': listSelect.length !== 0,
						})}
					>
						{deleteObjLibMutate.isPending && <ReloadIcon className="h-4 w-4 animate-spin" />}
						<Trash2 size={14} color="white" />
						<span>Delete</span>
						{listSelect.length !== 0 && <span className="min-w-[13px]">{listSelect.length}</span>}
					</button>
				</div>
				<div className="mt-10 grid grid-cols-12 gap-3">
					{isFetching ? (
						<>
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
							<Skeleton className="h-[200px] rounded-[28px] sm:col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2" />
						</>
					) : data?.objectLibraryList.length === 0 ? (
						<div className="col-span-full mt-2 text-center">No result for "{textDebounced}"</div>
					) : (
						data?.objectLibraryList.map((item) => (
							<div
								onClick={() => handleSelect(item.id)}
								key={item.id}
								className={clsx(
									`group relative col-span-full h-[200px] rounded-[28px] transition-all [perspective:1000px] active:scale-95 sm:col-span-6 md:col-span-4 md:h-[200px] lg:col-span-3 xl:col-span-2`,
									{
										'ring-2 ring-gray-400': listSelect.includes(item.id),
									}
								)}
							>
								{/* Card wrapper with 3D transform and hover rotation */}
								<div className="relative h-full w-full transition-transform duration-200 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
									{/* Front Side */}
									<div className="absolute inset-0 flex cursor-pointer flex-col justify-between rounded-[28px] border p-4 shadow [backface-visibility:hidden]">
										<div>
											<div className="w-fit rounded-md bg-gray-100 p-1.5">
												<Package size={20} />
											</div>
											<div className="mt-4 flex flex-col space-y-2">
												<div className="line-clamp-2 text-lg font-bold">{item.name}</div>
												<div className="flex space-x-2">
													<div
														dangerouslySetInnerHTML={{
															__html: updateSVGAttributes({
																svgString: item.lifeCycleStage.iconUrl,
																properties: {
																	width: 16,
																	height: 16,
																	fill: 'none',
																	color: 'black',
																},
															}),
														}}
													/>
													<div className="text-xs">{item.lifeCycleStage.name}</div>
												</div>
											</div>
										</div>

										<div className="text-xs">{timeAgo(item.createdAt)}</div>
									</div>

									{/* Back Side */}
									<div className="absolute inset-0 h-full cursor-pointer overflow-y-auto overflow-x-visible rounded-[28px] border p-2 shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]">
										<div className="grid grid-cols-2 gap-x-5 gap-y-4">
											{item.impacts.map((item, index) => (
												<div className="col-span-1 flex items-center justify-between space-x-1 text-xs" key={item.id}>
													<div className="flex items-center space-x-1">
														<div
															className=""
															dangerouslySetInnerHTML={{
																__html: updateSVGAttributes({
																	svgString: item.impactCategory.iconUrl,
																	properties: {
																		height: 17,
																		width: 17,
																		color: 'black',
																		fill: 'none',
																		strokeWidth: 2,
																	},
																}),
															}}
														/>
														<div className="font-medium">{item.impactCategory.midpointImpactCategory.abbr}</div>
													</div>
													<TooltipProvider delayDuration={300}>
														<Tooltip>
															<TooltipTrigger id={item.id} className="rounded px-1 hover:bg-gray-100">
																<div className="rounded px-[1px] text-[11px] font-semibold">
																	{formatWithExponential(item.unitLevel)}
																</div>
															</TooltipTrigger>
															<TooltipContent
																side={index % 2 !== 0 ? 'left' : 'right'}
																className="rounded-sm bg-black px-1 py-0.5"
																id={item.id}
															>
																<div className="font-medium">{item.impactCategory.midpointImpactCategory.unit.name}</div>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</motion.div>
	);
}
