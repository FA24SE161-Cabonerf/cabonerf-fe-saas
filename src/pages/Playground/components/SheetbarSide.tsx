import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { columns } from '@/pages/Playground/components/Sheetbar/columns';
import { ExchangeTable } from '@/pages/Playground/components/Sheetbar/ExchangeTable';
import SheetbarSearch from '@/pages/Playground/components/SheetbarSearch';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { useReactFlow } from '@xyflow/react';
import { Cog, Flame, Leaf, Plus, X } from 'lucide-react';
import React, { useContext, useMemo } from 'react';

function SheetbarSide() {
	const { setViewport } = useReactFlow();

	const { sheetState, sheetDispatch } = useContext(SheetbarContext);

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
													sheetDispatch({
														type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
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
													sheetDispatch({
														type: SheetBarDispatch.MODIFY_QUERY_PARAMS,
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
			<SheetbarSearch />
		</Dialog>
	);
}

export default React.memo(SheetbarSide);
