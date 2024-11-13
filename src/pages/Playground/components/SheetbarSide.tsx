import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { CreateProductExchange } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import ScrollableList from '@/components/ScrollableList';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExchangeItem from '@/pages/Playground/components/ExchangeItem';
import ProductItem from '@/pages/Playground/components/ProductItem';
import SheetbarSearch from '@/pages/Playground/components/SheetbarSearch';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { useMutation } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { Cog, Package, Plus, X } from 'lucide-react';
import React, { useContext, useMemo } from 'react';
import { toast } from 'sonner';

function SheetbarSide() {
	const { setViewport, setNodes } = useReactFlow<Node<CabonerfNodeData>>();

	const { sheetState, sheetDispatch } = useContext(SheetbarContext);

	const addNewProductExchangeMutate = useMutation({
		mutationFn: ExchangeApis.prototype.createProductExchange,
	});

	const elementaryExchangeInput = useMemo(() => {
		return sheetState.process
			? sheetState.process.exchanges.filter(
					(item) => item.input === true && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174001'
				)
			: [];
	}, [sheetState.process]);

	const elementaryExchangeOutput = useMemo(() => {
		return sheetState.process
			? sheetState.process.exchanges.filter(
					(item) => item.input === false && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174001'
				)
			: [];
	}, [sheetState.process]);

	const productExchangeOutput = useMemo(() => {
		return sheetState.process
			? sheetState.process.exchanges.find(
					(item) => item.input === false && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174000'
				)
			: undefined;
	}, [sheetState.process]);

	const productExchangeInput = useMemo(() => {
		return sheetState.process
			? sheetState.process.exchanges.filter(
					(item) => item.input === true && item.exchangesType.id === '723e4567-e89b-12d3-a456-426614174000'
				)
			: [];
	}, [sheetState.process]);

	const handleAddNewProductOutput = ({ input }: { input: boolean }) => {
		const newProductExchange: CreateProductExchange = {
			input: String(input),
			name: 'New product',
			processId: sheetState.process?.id as string,
		};

		addNewProductExchangeMutate.mutate(newProductExchange, {
			onSuccess: (data) => {
				const newProcess = data.data.data;

				setNodes((nodes) => {
					return nodes.map((node) => {
						if (node.id === newProcess.id) {
							const _newProcess = {
								...node,
								data: { ...node.data, impacts: newProcess.impacts, exchanges: newProcess.exchanges },
							};

							sheetDispatch({
								type: SheetBarDispatch.SET_NODE,
								payload: {
									id: _newProcess.id,
									color: _newProcess.data.color,
									description: _newProcess.data.description,
									exchanges: _newProcess.data.exchanges,
									impacts: _newProcess.data.impacts,
									lifeCycleStage: _newProcess.data.lifeCycleStage,
									name: _newProcess.data.name,
									overallProductFlowRequired: _newProcess.data.overallProductFlowRequired,
									projectId: _newProcess.data.projectId,
								},
							});
							return _newProcess;
						}
						return node;
					});
				});
			},
			onError: (error) => {
				toast(error.message);
			},
		});
	};

	const handleCloseSheetBar = () => {
		sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE });
		setViewport({ x: 0, y: 0, zoom: 0.7 }, { duration: 800 });
	};

	return (
		<Dialog modal={false}>
			<div className="absolute right-0 top-0 my-3 mr-3 h-[calc(100%-50px)] w-[550px] overflow-auto rounded-2xl border-[1.8px] bg-white">
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
							<TabsContent value="account" className="mt-4">
								<div className="space-y-4">
									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2 rounded-sm px-2 py-1 text-sm">
												<div className="uppercase text-[#166534]">Elementary Exchange Flow (INPUT)</div>
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
												asChild
												className="flex h-fit items-center space-x-1 rounded-sm px-2.5 py-1.5 text-white"
												aria-label="Add a new exchange entry"
											>
												<Button>
													<span className="text-xs">New Exchange</span>
													<Plus size={14} />
												</Button>
											</DialogTrigger>
										</div>

										<ScrollableList
											className="mt-4 h-[400px] space-y-3 overflow-scroll rounded-lg p-2"
											data={elementaryExchangeInput}
										>
											{elementaryExchangeInput.length > 0 ? (
												elementaryExchangeInput.map((item) => <ExchangeItem isInput data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No elementary</div>
											)}
										</ScrollableList>
									</div>

									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2 rounded-sm px-2 py-1 text-sm">
												<div className="uppercase text-[#166534]">Product exchange (INPUT)</div>
											</div>
											{/* Add new product output */}
											<Button
												disabled={addNewProductExchangeMutate.isPending}
												onClick={() => handleAddNewProductOutput({ input: true })}
												className={clsx(
													`flex h-fit items-center space-x-1 rounded-sm bg-[#0f766e] px-2.5 py-1.5 text-white hover:bg-[#22877f]`
												)}
											>
												<span className="text-xs">{addNewProductExchangeMutate.isPending ? 'Adding...' : 'New Product'}</span>
												<Package size={14} />
											</Button>
										</div>
										<ScrollableList className="mt-4 h-fit space-y-3 overflow-scroll rounded-lg p-2" data={productExchangeInput}>
											{productExchangeInput.length > 0 ? (
												productExchangeInput.map((item) => <ProductItem data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No product input</div>
											)}
										</ScrollableList>
									</div>
								</div>
							</TabsContent>
							<TabsContent value="password" className="mt-4">
								<div className="h-full space-y-4">
									<div className="w-full">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2 rounded-sm px-2 py-1 text-sm">
												<div className="uppercase text-[#166534]">Elementary Exchange Flow (OUTPUT)</div>
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
												asChild
												className="flex h-fit items-center space-x-1 rounded-sm px-2.5 py-1.5 text-white"
												aria-label="Add a new exchange entry"
											>
												<Button>
													<span className="text-xs">New Exchange</span>
													<Plus size={14} />
												</Button>
											</DialogTrigger>
										</div>

										<ScrollableList
											className="mt-4 h-[400px] space-y-3 overflow-scroll rounded-lg p-2"
											data={elementaryExchangeOutput}
										>
											{elementaryExchangeOutput.length > 0 ? (
												elementaryExchangeOutput.map((item) => <ExchangeItem isInput data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No elementary</div>
											)}
										</ScrollableList>
									</div>

									<div className="h-auto w-full">
										<div className="flex items-center justify-between">
											<div className="flex items-center space-x-2 rounded-sm px-2 py-1 text-sm">
												<div className="uppercase text-[#166534]">Product exchange (OUTPUT)</div>
											</div>

											<Button
												disabled={addNewProductExchangeMutate.isPending || productExchangeOutput !== undefined}
												onClick={() => handleAddNewProductOutput({ input: false })}
												className={clsx(
													`flex h-fit items-center space-x-1 rounded-sm bg-[#0f766e] px-2.5 py-1.5 text-white hover:bg-[#22877f]`
												)}
											>
												<span className="text-xs">{addNewProductExchangeMutate.isPending ? 'Adding...' : 'New Product'}</span>
												<Package size={14} />
											</Button>
										</div>
										<div className="mt-3 h-full w-full">
											{productExchangeOutput ? (
												<ProductItem data={productExchangeOutput} />
											) : (
												<div className="flex h-full items-center justify-center text-sm">Not product</div>
											)}
										</div>
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
