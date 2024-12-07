import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { CommonResponse } from '@/@types/common.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import EmissionCompartmentApis from '@/apis/emisisonCompartment.apis';
import { ExchangeApis } from '@/apis/exchange.apis';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import { EmissionSubstancesApis } from '@/apis/substance.api';
import ChemicalFormula from '@/components/ChemicalFormula';
import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
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
import { useDebounce } from '@/hooks/useDebounce';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { isUnprocessableEntity } from '@/utils/error';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { isUndefined, omitBy } from 'lodash';
import { Copy, ListFilter, Search, X } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'sonner';
const LIMIT_SIZE_PAGE = 7;

function SheetbarSearch() {
	const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();
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
			sheetState.queryParams.methodId,
		],
		queryFn: ({ pageParam, queryKey }) => {
			const sanitizeQueryParam = omitBy(sheetState.queryParams, isUndefined);

			return EmissionSubstancesApis.prototype.getEmissionSubstances({
				pageCurrent: pageParam ?? 1,
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
		enabled: !!sheetState.queryParams.input && !!sheetState.queryParams.methodId,
		placeholderData: (previousData) => previousData,
	});

	useEffect(() => {
		sheetDispatch({
			type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
			payload: {
				pageSize: LIMIT_SIZE_PAGE,
				keyword: searchTextDebounced,
				methodId: playgroundState.impactMethod,
			},
		});
	}, [sheetDispatch, playgroundState.impactMethod, searchTextDebounced]);

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
			const newExchanges = data.data.data;

			setNodes((nodes) => {
				return nodes.map((node) => {
					if (node.id === sheetState.process?.id) {
						const newProcess: Node<CabonerfNodeData> = {
							...node,
							data: {
								...node.data,
								exchanges: newExchanges,
							},
						};

						sheetDispatch({
							type: SheetBarDispatch.SET_NODE,
							payload: {
								id: sheetState.process.id,
								name: sheetState.process.name,
								description: sheetState.process.description,
								projectId: sheetState.process.projectId,
								color: sheetState.process.color,
								overallProductFlowRequired: sheetState.process.overallProductFlowRequired,
								impacts: sheetState.process.impacts,
								exchanges: newExchanges,
								lifeCycleStage: sheetState.process.lifeCycleStage,
								library: sheetState.process.library,
							},
						});

						return newProcess;
					}
					return node;
				});
			});
		},
		onError(err) {
			toast.error(err.message);
		},
	});

	const handleFetchNext = useCallback(() => {
		if (!isFetching) {
			fetchNextPage();
		}
	}, [isFetching, fetchNextPage]);

	const handleAddNewExchange = ({ substanceId }: { substanceId: string }) => {
		const processId = sheetState.process?.id as string;

		addNewExchangeMutate.mutate(
			{
				processId: processId,
				emissionSubstanceId: substanceId,
				input: sheetState.queryParams.input as string,
			},
			{
				onError: (error) => {
					if (isUnprocessableEntity<CommonResponse<string>>(error)) {
						const formError = error.response?.data.data;
						toast(formError);
					}
				},
			}
		);
	};

	useEffect(() => {
		return () => {
			setSearchText('');
		};
	}, []);

	return (
		<>
			<DialogTitle className="hidden"></DialogTitle>
			<DialogDescription className="hidden"></DialogDescription>
			<div className="h-full w-[670px]">
				<div className="flex w-full items-center space-x-2 p-4">
					<Search color="#9ca3af" strokeWidth="1.5" />
					<input
						type="text"
						value={searchText}
						onChange={(event) => setSearchText(event.target.value)}
						placeholder="Search emission substances..."
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
						className="relative"
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
						{addNewExchangeMutate.isPending && (
							<div className="absolute inset-0 z-50 flex items-center justify-center rounded-b-[14px] bg-gray-100 bg-opacity-50">
								<ReloadIcon className="h-4 w-4 animate-spin" />
							</div>
						)}
						{data.pages.map((item, index) => (
							<React.Fragment key={index}>
								{item.list.length > 0 ? (
									item.list.map((item) => {
										const isAdded =
											sheetState.process?.exchanges?.some((ex) => {
												return (
													ex.exchangesType.id === '723e4567-e89b-12d3-a456-426614174001' && ex.emissionSubstance.id === item.id
												);
											}) ?? false;

										return (
											<div
												onClick={() => !isAdded && handleAddNewExchange({ substanceId: item.id })}
												key={item.id}
												className={clsx(
													'relative z-10 flex w-full flex-col items-start justify-between space-y-3 px-5 py-4 transition-all hover:bg-[#efefef]',
													{ 'cursor-pointer': !isAdded, 'cursor-not-allowed text-gray-300': isAdded }
												)}
											>
												{/* Information */}
												<div className="flex w-full flex-col justify-center">
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
													<div className="flex w-full items-center justify-between">
														<div className="max-w-[70%] text-base font-semibold">{item.substance.name}</div>
														{/* <div
																className={clsx(`text-sm text-gray-400`, {
																	'text-gray-300': isAdded,
																})}
															></div> */}
														<kbd
															className={clsx(
																`flex items-center justify-center rounded bg-[#EFEFEF] px-1.5 py-0.5 text-[11px] font-medium text-gray-600`,
																{
																	'bg-[#F8f8f8] text-gray-400': isAdded,
																}
															)}
														>
															{item.emissionCompartment.name}
														</kbd>
													</div>
													<div className="text-sm italic text-gray-500">{item.substance.chemicalName}</div>
												</div>
												<div className="mt-1 flex w-full flex-wrap">
													{item.factors.map((factor) => (
														<div key={factor.id} className="flex basis-1/2 items-center space-x-2 text-sm text-gray-500">
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
																{factor.scientificValue}
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
				)}
			</div>
		</>
	);
}

export default React.memo(SheetbarSearch);
