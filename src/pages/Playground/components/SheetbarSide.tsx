import { SheetBarDispatch } from '@/@types/dispatch.type';
import { EmissionSubstancesApis } from '@/apis/substance.api';
import ChemicalFormula from '@/components/ChemicalFormula';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { columns } from '@/pages/Playground/components/Sheetbar/columns';
import { data as datas } from '@/pages/Playground/components/Sheetbar/data-table';
import { ExchangeTable } from '@/pages/Playground/components/Sheetbar/ExchangeTable';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { updateSVGAttributes } from '@/utils/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import DOMPurify from 'dompurify';
import 'katex/dist/katex.min.css';
import { Cog, Copy, Flame, Leaf, Plus, Search, X } from 'lucide-react';
import React, { useCallback, useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

function SheetbarSide() {
	const { setViewport } = useReactFlow();
	const { sheetDispatch } = useContext(SheetbarContext);

	const { data, fetchNextPage, isFetching } = useInfiniteQuery({
		queryKey: ['substances'],
		queryFn: EmissionSubstancesApis.prototype.getEmissionSubstances,
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.pageCurrent + 1,
	});

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
											<DialogTrigger className="flex h-fit items-center space-x-1 rounded px-2 py-1">
												<span className="text-sm">Add new exchange</span>
												<Plus size={14} />
											</DialogTrigger>
										</div>
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={datas} />
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
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={datas} />
										</div>
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
										<div className="mt-1 w-full">
											<ExchangeTable columns={columns} data={datas} />
										</div>
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
					<div className="flex space-x-2 p-2.5">
						<Search color="#d4d4d8" />
						<input type="text" placeholder="Search" className="w-full outline-none" />
					</div>
					<Separator />
					<div>Filter</div>
					<Separator />

					{/* List Substance */}
					<div className="mt-3 p-2">
						<InfiniteScroll
							next={handleFetchNext}
							height={400}
							hasMore={true}
							dataLength={data?.pages.length as number}
							loader={<div>loading</div>}
						>
							{data?.pages.map((item, index) => (
								<React.Fragment key={index}>
									{item.list.map((item) => (
										<div
											key={item.id}
											className="flex w-full flex-col items-start justify-between space-y-2 rounded p-2.5 hover:bg-zinc-100"
										>
											{/* Information */}
											<div className="flex w-full flex-col">
												<div className="flex justify-between">
													<div className="flex items-center space-x-2 text-xs">
														<span>CAS:</span>
														<div className="flex items-center space-x-1">
															<span>{item.emissionSubstance.cas}</span>
															<Copy size={12} />
														</div>
													</div>
													{item.emissionSubstance.molecularFormula ? (
														<ChemicalFormula className="text-[11px]" formula={item.emissionSubstance.molecularFormula} />
													) : (
														<ChemicalFormula className="text-[11px]" formula={item.emissionSubstance.alternativeFormula} />
													)}
												</div>
												<div className="flex w-full justify-between">
													<div className="max-w-[70%] text-base font-bold">{item.emissionSubstance.name}</div>
													<div className="text-sm text-gray-400">{item.emissionCompartment.name}</div>
												</div>
												<div className="text-sm italic text-gray-500">{item.emissionSubstance.chemicalName}</div>
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
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default React.memo(SheetbarSide);
