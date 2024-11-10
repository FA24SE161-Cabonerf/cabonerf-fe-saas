import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import EmissionCompartmentApis from '@/apis/emisisonCompartment.apis';
import { ExchangeApis } from '@/apis/exchange.apis';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import { EmissionSubstancesApis } from '@/apis/substance.api';
import ChemicalFormula from '@/components/ChemicalFormula';
import { DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
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
import { useDebounce } from '@/hooks/useDebounce';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { isUndefined, omitBy } from 'lodash';
import { Copy, ListFilter, Search, X } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
const LIMIT_SIZE_PAGE = 7;

function SheetbarSearch() {
	const { setNodes } = useReactFlow();
	const { playgroundState } = useContext(PlaygroundContext);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const [searchText, setSearchText] = useState<string>('');
	const [filterImpactCategory, setFilterImpactCategory] = useState<ImpactCategory>();
	const [filterEmissionCompartment, setFilterEmissionCompartment] = useState<string>();

	const searchTextDebounced = useDebounce<string>({ currentValue: searchText, delayTime: 500 });

	// Fetch substances
	const { data, fetchNextPage, isFetching, hasNextPage, isLoading } = useInfiniteQuery({
		queryKey: [
			'substances',
			sheetState.queryParams.input,
			sheetState.queryParams.keyword,
			sheetState.queryParams.emissionCompartmentId,
			sheetState.queryParams.impactCategoryId,
		],
		queryFn: ({ pageParam, queryKey }) => {
			const sanitizeQueryParam = omitBy(sheetState.queryParams, isUndefined);

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
		enabled: sheetState.queryParams.input !== undefined,
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
	const { data: impactCategoriesCachedData } = useQuery({
		queryKey: ['impact_categories', playgroundState.impactMethod],
		queryFn: () => ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: playgroundState.impactMethod as string }),
		enabled: playgroundState.impactMethod !== undefined,
		staleTime: 60 * 1000 * 10,
	});

	// Add new exchange
	const addNewExchangeMutate = useMutation({
		mutationFn: ExchangeApis.prototype.createElementaryExchange,
		onSuccess: (data) => {
			const newProcess = data.data.data;

			setNodes((nodes) => {
				return nodes.map((node) => {
					if (node.id === newProcess.id) {
						const _newProcess = {
							...node,
							data: { ...node.data, id: newProcess.id, impacts: newProcess.impacts, exchanges: newProcess.exchanges },
						};
						sheetDispatch({
							type: SheetBarDispatch.SET_NODE,
							payload: _newProcess.data as CabonerfNodeData & { id: string },
						});
						return _newProcess;
					}
					return node;
				});
			});
		},
	});

	useEffect(() => {
		sheetDispatch({
			type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
			payload: {
				pageSize: LIMIT_SIZE_PAGE,
				methodId: playgroundState.impactMethod as string,
				keyword: searchTextDebounced,
			},
		});
	}, [sheetDispatch, playgroundState.impactMethod, searchTextDebounced]);

	const handleFetchNext = useCallback(() => {
		if (!isFetching) {
			fetchNextPage();
		}
	}, [isFetching, fetchNextPage]);

	const handleAddNewExchange = ({ substanceId }: { substanceId: string }) => {
		console.log(sheetState.process);
		const processId = sheetState.process?.id as string;
		console.log(sheetState.process?.id);
		addNewExchangeMutate.mutate(
			{
				processId: processId,
				emissionSubstanceId: substanceId,
				input: sheetState.queryParams.input as string,
			},
			{
				onError: (err) => {
					console.log(err.message);
				},
			}
		);
	};

	return (
		<DialogContent className="border p-0 shadow-md [&>button]:hidden" style={{ borderRadius: 16 }}>
			<DialogTitle className="hidden"></DialogTitle>
			<DialogDescription className="hidden"></DialogDescription>
			<div className="h-full w-[512px]">
				<div className="flex w-full items-center space-x-2 p-3">
					<Search color="#d4d4d8" />
					<input
						type="text"
						value={searchText}
						onChange={(event) => setSearchText(event.target.value)}
						placeholder="Search"
						className="w-full max-w-full flex-grow outline-none"
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
										{impactCategoriesCachedData?.data.data.map((item) => (
											<DropdownMenuItem
												key={item.id}
												onClick={() => {
													sheetDispatch({
														type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
														payload: { impactCategoryId: item.id },
													});
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
													sheetDispatch({
														type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
														payload: { emissionCompartmentId: item.id },
													});
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
								sheetDispatch({ type: SheetBarDispatch.MODIFY_QUERY_PARAMS, payload: { impactCategoryId: undefined } });
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
								sheetDispatch({ type: SheetBarDispatch.MODIFY_QUERY_PARAMS, payload: { emissionCompartmentId: undefined } });
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
				{isLoading || !data?.pages?.length || addNewExchangeMutate.isPending ? (
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
										item.list.map((item) => {
											const isAdded = sheetState.process?.exchanges.some((ex) => ex.emissionSubstance.id === item.id);
											return (
												<div
													onClick={() => !isAdded && handleAddNewExchange({ substanceId: item.id })}
													key={item.id}
													className={clsx(
														'relative z-10 flex w-full flex-col items-start justify-between space-y-3 rounded p-2.5 hover:bg-[#f4f4f5]',
														{ 'cursor-pointer': !isAdded, 'cursor-not-allowed text-gray-300': isAdded }
													)}
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
															<div
																className={clsx(`text-sm text-gray-400`, {
																	'text-gray-300': isAdded,
																})}
															>
																{item.emissionCompartment.name}
															</div>
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
					</div>
				)}
			</div>
		</DialogContent>
	);
}

export default React.memo(SheetbarSearch);
