import ObjectLibraryApis from '@/apis/objectLibrary.apis';
import SystemBoundaryApis from '@/apis/systemBoundary.apis';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { AppContext } from '@/contexts/app.context';
import { useDebounce } from '@/hooks/useDebounce';
import { reducer } from '@/pages/Playground/reducer/searchObjectQueryParam.reducer';
import socket from '@/socket.io';
import { formatWithExponential, updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import DOMPurify from 'dompurify';
import { ListFilter, Search } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useReducer, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';

const dataColor = [
	{
		id: 'Cradle',
		bgColor: '#f5f3ff',
		textColor: '#9333ea',
	},
	{
		id: 'Gate',
		bgColor: '#eff6ff',
		textColor: '#2563eb',
	},
	{
		id: 'Grave',
		bgColor: '#eef2ff',
		textColor: '#4f46e5',
	},
];

function SheetbarSearchObjectLibrary() {
	const { pid } = useParams<{ pid: string }>();
	const {
		app: { currentOrganization, userProfile },
	} = useContext(AppContext);

	console.log(currentOrganization);

	const [queryParams] = useReducer(reducer, {
		organizationId: currentOrganization?.orgId as string,
	});

	const [searchText, setSearchText] = useState<string>('');
	const searchTextDebounced = useDebounce<string>({ currentValue: searchText, delayTime: 300 });

	const systemBoundaryQuery = useQuery({
		queryKey: ['system-boundary'],
		queryFn: SystemBoundaryApis.prototype.getAllSystemBoundary,
		staleTime: Infinity,
	});

	const { data, fetchNextPage, isFetching, isLoading, hasNextPage } = useInfiniteQuery({
		queryKey: ['object-libraries', queryParams.organizationId, searchTextDebounced, queryParams.systemBoundaryId],
		queryFn: ({ pageParam, queryKey }) => {
			return ObjectLibraryApis.prototype.getListObjectLibrary({
				organizationId: queryKey[1] as string, // Use explicit typing for safety
				keyword: queryKey[2] ?? '',
				systemBoundaryId: queryKey[3] as string,
				pageCurrent: pageParam ?? 1,
				pageSize: 6,
			});
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPage === lastPage.pageCurrent) {
				return undefined;
			}
			return lastPage.pageCurrent + 1;
		},
		placeholderData: (previousData) => previousData,
	});

	useEffect(() => {
		return () => {
			setSearchText('');
		};
	}, []);

	const addNewObjectLibrary = (objLibId: string) => () => {
		// Get properties of screen
		const screenWidth = window.innerWidth;
		const screenHeight = window.innerHeight;

		// Create new node
		const newNode = {
			projectId: pid,
			color: '#a3a3a3',
			userId: userProfile?.id,
			objectLibraryId: objLibId,
			position: {
				x: Math.floor(screenWidth / 2 - 400 + Math.random() * 300),
				y: Math.floor(screenHeight / 2 - 400 + Math.random() * 300),
			},
			type: 'process',
		};

		socket.emit('gateway:create-object-library', { data: newNode, projectId: pid });
	};

	useEffect(() => {
		return () => {
			socket.off('gateway:create-object-library');
		};
	}, []);

	const handleFetchNext = useCallback(() => {
		if (!isFetching) {
			fetchNextPage();
		}
	}, [isFetching, fetchNextPage]);

	return (
		<>
			<DialogTitle className="hidden"></DialogTitle>
			<DialogDescription className="hidden"></DialogDescription>
			<div className="h-full w-[700px] pb-2">
				<div className="flex w-full items-center space-x-2 p-4">
					<Search color="#9ca3af" strokeWidth="1.5" />
					<input
						type="text"
						value={searchText}
						onChange={(event) => setSearchText(event.target.value)}
						placeholder="Search for product, ultilities, materials, ..."
						className="w-full max-w-full bg-transparent py-2 text-base font-light text-gray-900 outline-none placeholder:tracking-wider placeholder:text-gray-500"
					/>
					<div className="min-w-4">
						{isFetching ? (
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
						) : (
							<kbd className="items-center justify-center rounded bg-[#EFEFEF] px-2 py-1 text-xs font-medium text-gray-500 sm:flex">
								ESC
							</kbd>
						)}
					</div>
				</div>
				<div className="mt-2 flex min-h-[25px] items-center space-x-2 px-3">
					<div className="mb-2 flex items-center space-x-2 text-sm uppercase tracking-wider text-gray-400">
						<span>Filter by</span>
						<DropdownMenu modal={true}>
							<DropdownMenuTrigger className="flex items-center space-x-1 rounded-full border p-1.5 font-normal shadow-sm hover:bg-gray-50">
								<ListFilter size={13} />
							</DropdownMenuTrigger>
							<DropdownMenuContent onClick={(e) => e.stopPropagation()}>
								<DropdownMenuLabel>Filter substances</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>By system boundary</DropdownMenuSubTrigger>
									<DropdownMenuSubContent>
										{systemBoundaryQuery.data?.data.data.map((item) => (
											<DropdownMenuItem className="text-xs" key={item.id}>
												{item.boundaryFrom} to {item.boundaryTo}
											</DropdownMenuItem>
										))}
									</DropdownMenuSubContent>
								</DropdownMenuSub>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				{/* EndItem */}
				{isLoading || !data?.pages?.length ? (
					<div className="flex items-center justify-center">
						<div className="flex items-center p-5">
							<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							<span>Loading substance...</span>
						</div>
					</div>
				) : (
					<InfiniteScroll
						next={handleFetchNext}
						height={550}
						hasMore={hasNextPage}
						dataLength={data.pages.length}
						loader={
							<div className="flex items-center justify-center">
								<div className="flex items-center">
									<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
									<span>Loading...</span>
								</div>
							</div>
						}
						scrollThreshold={0.9}
						endMessage={
							<div className="mt-3 flex items-center">
								<div className="mx-auto text-xs">You’ve reached the end</div>
							</div>
						}
					>
						{data.pages.map((item, index) => (
							<React.Fragment key={index}>
								{item.objectLibraryList.length > 0 ? (
									item.objectLibraryList.map((item) => {
										const fromColor = dataColor.find((c) => c.id === item.systemBoundary.boundaryFrom);
										const toColor = dataColor.find((c) => c.id === item.systemBoundary.boundaryTo);

										return (
											<div
												key={item.id}
												onClick={addNewObjectLibrary(item.id)}
												className="cursor-pointer px-3 py-2.5 hover:bg-gray-50"
											>
												<div className="flex h-full items-center">
													<div className="flex w-[10%] items-center">
														<svg
															className="ml-5"
															xmlns="http://www.w3.org/2000/svg"
															viewBox="0 0 24 24"
															width={20}
															height={20}
															color={'#525252'}
															fill={'none'}
														>
															<path
																d="M11 22C10.1818 22 9.40019 21.6698 7.83693 21.0095C3.94564 19.3657 2 18.5438 2 17.1613C2 16.7742 2 10.0645 2 7M11 22L11 11.3548M11 22C11.7248 22 12.293 21.7409 13.5 21.2226M20 7V11"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M15 17.5H22M18.5 21L18.5 14"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
															/>
															<path
																d="M7.32592 9.69138L4.40472 8.27785C2.80157 7.5021 2 7.11423 2 6.5C2 5.88577 2.80157 5.4979 4.40472 4.72215L7.32592 3.30862C9.12883 2.43621 10.0303 2 11 2C11.9697 2 12.8712 2.4362 14.6741 3.30862L17.5953 4.72215C19.1984 5.4979 20 5.88577 20 6.5C20 7.11423 19.1984 7.5021 17.5953 8.27785L14.6741 9.69138C12.8712 10.5638 11.9697 11 11 11C10.0303 11 9.12883 10.5638 7.32592 9.69138Z"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M5 12L7 13"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M16 4L6 9"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
														</svg>
													</div>
													{/* Name, Location, Boundary */}
													<div className="w-[90%]">
														<div className="font-semibold text-[#525252]">{item.name}</div>
														<div className="mt-1 flex justify-between">
															{/* Location & Boundray */}
															<div className="flex items-center space-x-5 text-xs">
																<div className="flex items-center space-x-1 rounded-full bg-gray-100 px-2 py-1 font-medium">
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		width="15"
																		height="15"
																		color="#000000"
																		fill="none"
																	>
																		<path
																			d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z"
																			stroke="currentColor"
																			strokeWidth="1.5"
																		/>
																		<path
																			d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z"
																			stroke="currentColor"
																			strokeWidth="1.5"
																		/>
																		<path
																			d="M18 20C18 21.1046 15.3137 22 12 22C8.68629 22 6 21.1046 6 20"
																			stroke="currentColor"
																			strokeWidth="1.5"
																			strokeLinecap="round"
																		/>
																	</svg>
																	<span>Viet Nam</span>
																</div>
																<div className="flex items-center space-x-3">
																	<div
																		className="rounded-full px-2 py-0.5 font-medium"
																		style={{
																			backgroundColor: fromColor?.bgColor,
																			color: fromColor?.textColor,
																		}}
																	>
																		{item.systemBoundary.boundaryFrom}
																	</div>
																	<div className="font-medium">to</div>
																	<div
																		className="rounded-full px-2 py-0.5 font-medium"
																		style={{
																			backgroundColor: toColor?.bgColor,
																			color: toColor?.textColor,
																		}}
																	>
																		{item.systemBoundary.boundaryTo}
																	</div>
																</div>
															</div>
															{/* Impacts */}
															<div className="text-sm">
																{item.impacts.length > 0 && (
																	<DropdownMenu>
																		<DropdownMenuTrigger asChild>
																			<button className="flex items-center space-x-2 rounded p-0.5 text-xs outline-1 outline-gray-300 hover:bg-gray-200 hover:outline">
																				<div
																					dangerouslySetInnerHTML={{
																						__html: DOMPurify.sanitize(
																							updateSVGAttributes({
																								svgString: item.impacts[0].impactCategory.iconUrl,
																								properties: {
																									color: 'black',
																									fill: 'none',
																									height: 20,
																									width: 20,
																									strokeWidth: 1,
																								},
																							})
																						),
																					}}
																				/>
																				<div className="flex items-center space-x-1 text-xs">
																					<span className="font-bold">{item.impacts[0].unitLevel}</span>
																					<span>
																						{item.impacts[0].impactCategory.midpointImpactCategory.unit.name}
																					</span>
																				</div>
																			</button>
																		</DropdownMenuTrigger>
																		<DropdownMenuContent
																			onWheel={(e) => e.stopPropagation()}
																			className="h-[400px] w-[550px] overflow-scroll scroll-smooth p-0"
																		>
																			<div className="sticky left-0 right-0 top-0 grid grid-cols-12 border-b bg-white px-2 py-1.5">
																				<div className="col-span-8 mx-auto text-sm font-semibold">Impact Category</div>
																				<div className="col-span-4 text-center text-sm font-semibold">Unit Level</div>
																			</div>
																			{item.impacts.map((impact, index) => (
																				<div key={index} className="grid grid-cols-12 space-y-1 px-2 py-0.5">
																					<div className="col-span-8 flex items-center space-x-3">
																						<div
																							dangerouslySetInnerHTML={{
																								__html: DOMPurify.sanitize(
																									updateSVGAttributes({ svgString: impact.impactCategory.iconUrl })
																								),
																							}}
																						/>
																						<div className="flex flex-col">
																							<span className="text-sm font-medium">
																								{impact.impactCategory.name}
																							</span>
																							<span className="text-xs text-gray-500">
																								{impact.impactCategory.midpointImpactCategory.name} (
																								{impact.impactCategory.midpointImpactCategory.abbr})
																							</span>
																						</div>
																					</div>
																					<div className="col-span-4 text-center text-sm font-semibold">
																						{formatWithExponential(impact.unitLevel)}
																					</div>
																				</div>
																			))}
																		</DropdownMenuContent>
																	</DropdownMenu>
																)}
															</div>
														</div>
														<Separator className="mt-2" />
														<div className="flex items-center justify-between">
															<div className="text-xs text-[#525252]">Data set: {currentOrganization?.orgName}</div>
															<div className="text-xs">
																per {item.exchanges[0].value} {item.exchanges[0].unit.name} {item.exchanges[0].name}
															</div>
														</div>
													</div>
												</div>
											</div>
										);
									})
								) : (
									<div className="flex h-full items-center justify-center text-center">
										<div className="overflow-auto break-words">No result for ‘{searchTextDebounced}’</div>
									</div>
								)}
							</React.Fragment>
						))}
					</InfiniteScroll>
				)}
			</div>
		</>
	);
}

export default React.memo(SheetbarSearchObjectLibrary);
