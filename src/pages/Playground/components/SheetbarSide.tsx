import { CommonResponse } from '@/@types/common.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import EmissionCompartmentApis from '@/apis/emisisonCompartment.apis';
import { EmissionSubstancesApis } from '@/apis/substance.api';
import ChemicalFormula from '@/components/ChemicalFormula';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/useDebounce';
import { columns } from '@/pages/Playground/components/Sheetbar/columns';
import { ExchangeTable } from '@/pages/Playground/components/Sheetbar/ExchangeTable';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { initQueryParams, reducer } from '@/pages/Playground/reducer/queryParam.reducer';
import { queryClient } from '@/queryClient';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import DOMPurify from 'dompurify';
import { isUndefined, omitBy } from 'lodash';
import { Cog, Copy, Flame, Leaf, ListFilter, Plus, Search, X } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const LIMIT_SIZE_PAGE = 7;

function SheetbarSide() {
	const { setViewport } = useReactFlow();
	const [state, dispatch] = useReducer(reducer, initQueryParams);
	const { playgroundState } = useContext(PlaygroundContext);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const [searchText, setSearchText] = useState<string>('');
	const [filterImpactCategory, setFilterImpactCategory] = useState<ImpactCategory>();
	const [filterEmissionCompartment, setFilterEmissionCompartment] = useState<string>();

	const searchTextDebounced = useDebounce<string>({ currentValue: searchText, delayTime: 500 });

	console.log('!23');

	// Fetch substances
	const { data, fetchNextPage, isFetching, hasNextPage, isLoading } = useInfiniteQuery({
		queryKey: ['substances', state.input, state.keyword, state.emissionCompartmentId, state.impactCategoryId],
		queryFn: ({ pageParam, queryKey }) => {
			const sanitizeQueryParam = omitBy(state, isUndefined);

			return EmissionSubstancesApis.prototype.getEmissionSubstances({
				pageCurrent: pageParam,
				input: String(queryKey[1]),
				...sanitizeQueryParam,
			});
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPage === lastPage.pageCurrent) {
				return undefined;
			}
			return lastPage.pageCurrent + 1;
		},
		enabled: state.input !== undefined,
		staleTime: 1000 * 60 * 2,
		placeholderData: (previousData) => previousData,
	});

	// Fetch emission compartment
	const { data: emissionCompartment } = useQuery({
		queryKey: ['emission-compartment'],
		queryFn: EmissionCompartmentApis.prototype.getListEmissionCompartment,
		staleTime: 60 * 1000 * 10,
	});

	// Get impact category
	const { data: impactCategoriesCachedData } = queryClient.getQueryData<CommonResponse<ImpactCategory[]>>([
		'impact_categories',
		playgroundState.impactMethod?.id,
	]);

	const elementaryExchangeInput = useMemo(() => {
		return sheetState.process?.exchanges.filter(
			(item) => item.input === false && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174001'
		);
	}, [sheetState.process?.exchanges]);

	const elementaryExchangeOutput = useMemo(() => {
		return sheetState.process?.exchanges.filter(
			(item) => item.input === true && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174001'
		);
	}, [sheetState.process?.exchanges]);

	useEffect(() => {
		dispatch({
			type: 'MODIFY_QUERY_PARAMS',
			payload: {
				pageSize: LIMIT_SIZE_PAGE,
				methodId: playgroundState.impactMethod?.id as string,
				keyword: searchTextDebounced,
			},
		});
	}, [dispatch, playgroundState.impactMethod?.id, searchTextDebounced]);

	const handleFetchNext = useCallback(() => {
		if (!isFetching) {
			fetchNextPage();
		}
	}, [isFetching, fetchNextPage]);

	const handleCloseSheetBar = () => {
		sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
		setViewport({ x: 0, y: 0, zoom: 0.7 }, { duration: 800 });
	};

	return (
		<Dialog modal={false}>
			<div className="absolute right-0 top-0 my-3 mr-3 h-[calc(100%-50px)] w-[600px] overflow-auto rounded-2xl border-[1.8px] bg-white">
				{/* Header */}

				<div className="px-4 py-2.5">
					<div className="flex items-center justify-end">
						<button onClick={handleCloseSheetBar} className="rounded-md border p-2 shadow-sm hover:bg-gray-50">
							<X size={19} />
						</button>
					</div>
					<div className="mt-">
						<Tabs defaultValue="account" className="w-full">
							<TabsList className="w-full">
								<TabsTrigger className="w-full" value="account">
									Input line
								</TabsTrigger>
								<TabsTrigger className="w-full" value="password">
									Output line
								</TabsTrigger>
							</TabsList>
							<TabsContent value="account">
								<div className="space-y-4">
									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex w-fit items-center space-x-1 rounded-sm px-2 py-1 text-xs">
												<Leaf size={20} fill="#166534" color="white" />
												<span className="text-[#166534]">Elementary Exchange Flow (Input)</span>
											</div>
											<DialogTrigger
												onClick={() =>
													dispatch({
														type: 'MODIFY_QUERY_PARAMS',
														payload: {
															input: 'true',
														},
													})
												}
												className="flex h-fit items-center space-x-1 rounded-sm px-2 py-1 hover:bg-gray-100"
											>
												<span className="text-sm">Add new exchange</span>
												<Plus size={14} />
											</DialogTrigger>
										</div>
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={elementaryExchangeInput ?? []} />
										</div>
									</div>

									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex w-fit items-center space-x-1 rounded-sm px-2 py-1 text-xs">
												<Cog size={20} fill="white" color="#9333ea" />
												<span className="text-[#9333ea]">Elementary Product Flow (Input)</span>
											</div>
											<Button variant="ghost" className="flex h-fit items-center space-x-1 rounded px-2 py-1">
												<span className="text-sm">Add new product</span>
												<Plus size={14} />
											</Button>
										</div>
										<div className="mt-1 w-full">{/* <ExchangeTable columns={columns} data={datas} /> */}</div>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="password">
								<div className="h-full space-y-4">
									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex w-fit items-center space-x-1 rounded-sm px-2 py-1 text-xs">
												<Flame size={20} fill="#166534" color="#166534" />
												<span className="text-[#166534]">Elementary Exchange Flow (Output)</span>
											</div>
											<DialogTrigger
												onClick={() =>
													dispatch({
														type: 'MODIFY_QUERY_PARAMS',
														payload: {
															input: 'false',
														},
													})
												}
												className="flex h-fit items-center space-x-1 rounded-sm px-2 py-1 hover:bg-gray-100"
											>
												<span className="text-sm">Add new exchange</span>
												<Plus size={14} />
											</DialogTrigger>
										</div>
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={elementaryExchangeOutput ?? []} />
										</div>
										<div className="mt-1 w-full">{/* <ExchangeTable columns={columns} data={datas} /> */}</div>
									</div>

									<div className="h-auto w-full">
										<div className="flex items-center justify-between">
											<div className="flex w-fit items-center space-x-1 rounded-sm px-2 py-1 text-xs">
												<Cog size={20} fill="white" color="#9333ea" />
												<span className="text-[#9333ea]">Elementary Product Flow (Output)</span>
											</div>
											<Button variant="ghost" className="flex h-fit items-center space-x-1 rounded px-2 py-1">
												<span className="text-sm">Add new product</span>
												<Plus size={14} />
											</Button>
										</div>
										<div className="mt-1 flex h-full w-full items-center justify-center">data</div>
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
			<DialogContent className="w-full max-w-[500px] border p-0 shadow-md [&>button]:hidden" style={{ borderRadius: 16 }}>
				<DialogTitle className="hidden"></DialogTitle>
				<DialogDescription className="hidden"></DialogDescription>
				<div className="h-full w-full">
					<div className="flex max-w-full items-center space-x-2 p-3">
						<Search color="#d4d4d8" />
						<input
							type="text"
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							placeholder="Search"
							className="inline-block w-full outline-none"
						/>
						{isFetching && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
						<DropdownMenu modal={false}>
							<DropdownMenuTrigger className="flex items-center space-x-1 rounded-full border p-1.5 shadow-sm hover:bg-gray-50">
								<ListFilter size={17} />
							</DropdownMenuTrigger>
							<DropdownMenuContent onClick={(e) => e.stopPropagation()}>
								<DropdownMenuLabel>Filter substances</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<span>Impact category</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											{(impactCategoriesCachedData as CommonResponse<ImpactCategory[]>).data.map((item) => (
												<DropdownMenuItem
													key={item.id}
													onClick={() => {
														dispatch({ type: 'MODIFY_QUERY_PARAMS', payload: { impactCategoryId: item.id } });
														setFilterImpactCategory(item);
													}}
												>
													<div className="flex items-center space-x-3">
														<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.iconUrl) }} />
														<div className="flex flex-col">
															<span className="text-xs text-gray-500">
																{item.midpointImpactCategory.name} ({item.midpointImpactCategory.abbr})
															</span>
														</div>
													</div>
												</DropdownMenuItem>
											))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<span>Emission compartment</span>
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent>
											{emissionCompartment?.data.data.map((item) => (
												<DropdownMenuItem
													key={item.id}
													onClick={() => {
														dispatch({ type: 'MODIFY_QUERY_PARAMS', payload: { emissionCompartmentId: item.id } });
														setFilterEmissionCompartment(item.name);
													}}
												>
													<span className="text-xs text-gray-500">{item.name}</span>
												</DropdownMenuItem>
											))}
										</DropdownMenuSubContent>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<Separator />
					<div className="mt-2 flex min-h-[25px] items-center space-x-2 px-3">
						<div className="text-sm text-gray-500">Filter by:</div>
						{filterImpactCategory && (
							<button
								onClick={() => {
									dispatch({ type: 'MODIFY_QUERY_PARAMS', payload: { impactCategoryId: undefined } });
									setFilterImpactCategory(undefined);
								}}
								className="flex items-center space-x-1 rounded bg-[#bbf7d0] px-2 py-1 hover:bg-opacity-60"
							>
								<div
									dangerouslySetInnerHTML={{
										__html: DOMPurify.sanitize(
											updateSVGAttributes({
												svgString: filterImpactCategory.iconUrl,
												properties: { color: '#15803d', fill: '#bbf7d0', height: 15, width: 15 },
											})
										),
									}}
								/>
								<div className="text-xs text-[#15803d]">{filterImpactCategory.name}</div>
								<X size={11} color="#15803d" />
							</button>
						)}
						{filterEmissionCompartment && (
							<button
								onClick={() => {
									dispatch({ type: 'MODIFY_QUERY_PARAMS', payload: { emissionCompartmentId: undefined } });
									setFilterEmissionCompartment(undefined);
								}}
								className="flex items-center space-x-1 rounded bg-[#e0e7ff] px-2 py-1 hover:bg-opacity-60"
							>
								<div className="text-xs text-[#6366f1]">{filterEmissionCompartment}</div>
								<X size={11} color="#6366f1" />
							</button>
						)}
					</div>
					{/* List Substance */}
					{isLoading || !data?.pages?.length ? (
						<div className="flex items-center justify-center">
							<div className="flex items-center p-5">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
								<span>Loading substance...</span>
							</div>
						</div>
					) : (
						<div className="p-2">
							<InfiniteScroll
								next={handleFetchNext}
								height={450}
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
										{item.list.length > 0 ? (
											item.list.map((item) => (
												<div
													key={item.id}
													className="flex w-full flex-col items-start justify-between space-y-3 rounded p-2.5 hover:bg-[#f4f4f5]"
												>
													{/* Information */}
													<div className="flex w-full flex-col">
														<div className="flex justify-between">
															<div className="flex items-center space-x-2 text-xs">
																<span>CAS:</span>
																<div className="flex items-center space-x-1">
																	<span>{item.substance.cas}</span>
																	<Copy size={12} />
																</div>
															</div>
															{item.substance.molecularFormula ? (
																<ChemicalFormula className="text-[11px]" formula={item.substance.molecularFormula} />
															) : (
																<ChemicalFormula className="text-[11px]" formula={item.substance.alternativeFormula} />
															)}
														</div>
														<div className="flex w-full justify-between">
															<div className="max-w-[70%] text-base font-bold">{item.substance.name}</div>
															<div className="text-sm text-gray-400">{item.emissionCompartment.name}</div>
														</div>
														<div className="text-sm italic text-gray-500">{item.substance.chemicalName}</div>
													</div>

													<div className="mt-1 flex w-full flex-wrap">
														{item.factors.map((factor) => (
															<div key={factor.id} className="flex basis-1/2 items-center space-x-2 text-[15px]">
																<div
																	className=""
																	dangerouslySetInnerHTML={{
																		__html: DOMPurify.sanitize(
																			updateSVGAttributes({
																				svgString: factor.impactMethodCategory.impactCategory.iconUrl,
																			})
																		),
																	}}
																/>
																<div>
																	{factor.scientificValue}{' '}
																	{factor.impactMethodCategory.impactCategory.midpointImpactCategory.unit.name}
																</div>
															</div>
														))}
													</div>
												</div>
											))
										) : (
											<div className="flex h-full items-center justify-center text-center">
												<div className="overflow-auto break-words">No result for ‘{searchTextDebounced}’</div>
											</div>
										)}
									</React.Fragment>
								))}
							</InfiniteScroll>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default React.memo(SheetbarSide);
