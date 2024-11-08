import { SheetBarDispatch } from '@/@types/dispatch.type';
import { EmissionSubstancesApis } from '@/apis/substance.api';
import ChemicalFormula from '@/components/ChemicalFormula';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { columns } from '@/pages/Playground/components/Sheetbar/columns';
import { ExchangeTable } from '@/pages/Playground/components/Sheetbar/ExchangeTable';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { updateSVGAttributes } from '@/utils/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import DOMPurify from 'dompurify';
import { Cog, Copy, Flame, Leaf, Plus, Search, X } from 'lucide-react';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function SheetbarSide() {
	const [isInput, setIsInput] = useState<boolean | null>(null);
	const { setViewport } = useReactFlow();
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const [searchText, setSearchText] = useState<string>('');

	const { data, fetchNextPage, isFetching, isLoading, hasNextPage, refetch } = useInfiniteQuery({
		queryKey: ['substances'],
		queryFn: EmissionSubstancesApis.prototype.getEmissionSubstances,
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.totalPage === lastPage.pageCurrent) {
				return undefined;
			}
			return lastPage.pageCurrent + 1;
		},
		enabled: isInput !== null,
	});

	useEffect(() => {
		return () => {
			setIsInput(null);
		};
	}, []);

	const handleFetchNext = useCallback(() => {
		if (!isFetching) {
			fetchNextPage();
		}
	}, [isFetching, fetchNextPage]);

	const handleFetch = () => {
		setIsInput(true);
		refetch();
	};

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
												onClick={handleFetch}
												className="flex h-fit items-center space-x-1 rounded-sm px-2 py-1 hover:bg-gray-100"
											>
												<span className="text-sm">Add new exchange</span>
												<Plus size={14} />
											</DialogTrigger>
										</div>
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={sheetState.process?.exchanges ?? []} />
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
											<Button variant="ghost" className="flex h-fit items-center space-x-1 rounded px-2 py-1">
												<span className="text-sm">Add new exchange</span>
												<Plus size={14} />
											</Button>
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
			<DialogContent className="border p-0 shadow-md [&>button]:hidden" style={{ borderRadius: 16 }}>
				<DialogTitle className="hidden"></DialogTitle>
				<DialogDescription className="hidden"></DialogDescription>
				<div className="h-full w-full">
					<div className="flex space-x-2 p-3">
						<Search color="#d4d4d8" />
						<input
							type="text"
							value={searchText}
							onChange={(event) => setSearchText(event.target.value)}
							placeholder="Search"
							className="w-full outline-none"
						/>
					</div>
					<Separator />
					<div>Filter</div>
					<Separator />

					{/* List Substance */}
					<div className="mt-3 p-2">
						{isLoading ? (
							<div className="flex justify-center">
								<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
							</div>
						) : (
							<InfiniteScroll
								next={handleFetchNext}
								height={500}
								hasMore={hasNextPage}
								dataLength={(data?.pages.length as number) ?? 0}
								loader={
									<div className="flex items-center justify-center">
										<div className="flex items-center">
											<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
											<span>Loading...</span>
										</div>
									</div>
								}
								endMessage={
									<div className="flex items-center">
										<div className="mx-auto">End</div>
									</div>
								}
							>
								{data?.pages.map((item, index) => (
									<React.Fragment key={index}>
										{item.list.map((item) => (
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
										))}
									</React.Fragment>
								))}
							</InfiniteScroll>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default React.memo(SheetbarSide);
