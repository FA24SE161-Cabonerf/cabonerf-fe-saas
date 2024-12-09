import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { CreateProductExchange } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import LifeCycleStagesApis from '@/apis/lifeCycleStages.apis';
import ProcessApis from '@/apis/process.apis';
import ScrollableList from '@/components/ScrollableList';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ExchangeItem from '@/pages/Playground/components/ExchangeItem';
import ProductItem from '@/pages/Playground/components/ProductItem';
import SheetbarSearch from '@/pages/Playground/components/SheetbarSearch';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { ProcessSchema, processSchema } from '@/schemas/validation/process.schema';
import { updateSVGAttributes } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Node, useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import DOMPurify from 'dompurify';
import { ChevronsUpDown, Package, Pen, Plus, X } from 'lucide-react';
import React, { useContext, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

function SheetbarSide() {
	const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const [isUpdate, setIsUpdate] = useState<boolean>(false);
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const updateNodeInternals = useUpdateNodeInternals();

	const form = useForm<ProcessSchema>({
		resolver: zodResolver(processSchema),
		defaultValues: {
			name: sheetState.process?.name,
			description: sheetState.process?.description,
			lifeCycleStage: sheetState.process?.lifeCycleStage,
		},
	});

	const value = form.watch('lifeCycleStage');

	const addNewProductExchangeMutate = useMutation({
		mutationFn: ExchangeApis.prototype.createProductExchange,
	});

	const lifeCycleStagesQuery = useQuery({
		queryKey: ['life-cycle-stage'],
		queryFn: LifeCycleStagesApis.prototype.getAllLifeCycleStages,
		staleTime: 60_000 * 60,
	});

	const updateProcessMutation = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { name: string; description: string; lifeCycleStagesId: string } }) =>
			ProcessApis.prototype.updateProcess(id, payload),
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
									bgColor: sheetState.process.bgColor,
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

				updateNodeInternals(sheetState.process?.id as string);
			},

			onError: (error) => {
				toast(error.message);
			},
		});
	};

	const onSubmit: SubmitHandler<ProcessSchema> = (data) => {
		const newvalue = {
			name: data.name,
			description: data.description || '',
			lifeCycleStagesId: data.lifeCycleStage.id,
		};

		updateProcessMutation.mutate(
			{ id: sheetState.process?.id as string, payload: newvalue },
			{
				onSuccess: (data) => {
					const newNodeInformation = data.data.data;

					setNodes((nodes) => {
						return nodes.map((item) => {
							if (item.id === sheetState.process?.id) {
								const newNode = {
									...item,
									data: {
										...item.data,
										name: newNodeInformation.name,
										description: newNodeInformation.description,
										lifeCycleStage: newNodeInformation.lifeCycleStage,
									},
								};

								sheetDispatch({
									type: SheetBarDispatch.SET_NODE,
									payload: {
										id: sheetState.process.id,
										name: newNodeInformation.name,
										description: newNodeInformation.description,
										projectId: sheetState.process.projectId,
										bgColor: sheetState.process.bgColor,
										color: sheetState.process.color,
										overallProductFlowRequired: sheetState.process.overallProductFlowRequired,
										impacts: sheetState.process.impacts,
										exchanges: sheetState.process.exchanges,
										lifeCycleStage: newNodeInformation.lifeCycleStage,
										library: sheetState.process.library, // Add the missing 'library' property
									},
								});
								setIsUpdate(false);

								return newNode;
							}
							return item;
						});
					});
				},
			}
		);
	};

	return (
		<Dialog modal={true}>
			<div className="absolute right-0 top-0 z-30 mt-[59px] h-full w-[420px] overflow-auto border-l border-[#eeeeee] bg-white">
				{/* Header */}
				<div className="sticky left-0 right-0 top-0 z-50 mb-1 flex items-center justify-between bg-white">
					<div className="px-5 py-3 text-[13px] font-medium">Edit process detail</div>
					<button onClick={() => sheetDispatch({ type: SheetBarDispatch.REMOVE_NODE })} className="px-5">
						<X size={16} />
					</button>
				</div>
				<div className="relative px-5">
					<div className="flex items-start space-x-2">
						<div className="rounded-xl p-2" style={{ backgroundColor: sheetState.process?.color }}>
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(
										updateSVGAttributes({
											svgString: sheetState.process?.lifeCycleStage.iconUrl as string,
											properties: { color: 'white', fill: 'white', height: 26, width: 26 },
										})
									),
								}}
							/>
						</div>
						<div>
							<div className="text-xl font-semibold">{sheetState.process?.name}</div>
							<div className="text-sm font-normal text-[#b0afaf]">{sheetState.process?.lifeCycleStage.name}</div>
						</div>
					</div>
					{/* INformation */}
					<form className="my-5" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex items-start gap-2">
							<div className="w-1/2">
								<div className="mb-1 text-xs font-semibold">Process name</div>

								{isUpdate ? (
									<input
										className="w-full rounded-[8px] bg-[#f0f0f0] px-2 py-2 text-[13px] outline-[0.5px] outline-green-700 transition-transform"
										type="text"
										{...form.register('name')}
									/>
								) : (
									<div className="flex min-h-9 items-center justify-start text-[13px] text-[#444444D6]">
										{form.getValues('name')}
									</div>
								)}
							</div>
							<div className="w-1/2">
								<div className="mb-1 text-right text-xs font-semibold">Life cycle stage</div>

								{isUpdate ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button className="flex w-full items-center justify-between rounded-[8px] bg-[#f0f0f0] px-2 py-2 text-[13px] font-normal text-black shadow-none hover:bg-[#e3e3e3]">
												{value.name}
												<ChevronsUpDown size={14} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{lifeCycleStagesQuery.data?.data.data.map((item) => (
												<DropdownMenuItem
													onClick={() => form.setValue('lifeCycleStage', item)}
													key={item.id}
													className="w-full px-2 py-1"
												>
													{item.name}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								) : (
									<div className="min-h-9 break-words text-right text-[13px] text-[#444444D6]">
										{form.getValues('lifeCycleStage.name')}
									</div>
								)}
							</div>
						</div>
						<div className="mt-2">
							<div className="mb-1 text-xs font-semibold">Description</div>
							{isUpdate ? (
								<textarea
									{...form.register('description')}
									className="h-fit w-full rounded-[8px] bg-[#f0f0f0] px-2 py-2 text-[13px] outline-[0.5px] outline-green-700"
								/>
							) : (
								<div className="min-h-6 break-words text-[13px] text-[#444444D6]">{form.getValues('description')}</div>
							)}
						</div>
						<div className="mt-3 flex justify-end">
							{isUpdate ? (
								<div className="flex space-x-2">
									<Button
										onClick={() => setIsUpdate(false)}
										type="button"
										variant={'destructive'}
										disabled={updateProcessMutation.isPending}
										className="h-fit px-2 py-1.5 text-[13px]"
									>
										Cancel
									</Button>

									<Button type="submit" disabled={updateProcessMutation.isPending} className="h-fit px-2 py-1.5 text-[13px]">
										{updateProcessMutation.isPending ? 'Saving...' : 'Save'}
									</Button>
								</div>
							) : (
								<Button variant={'ghost'} className="space-x-2 px-2 py-0.5" onClick={() => setIsUpdate(true)}>
									<Pen size={14} />
									<span className="text-[13px] font-semibold">Edit</span>
								</Button>
							)}
						</div>
					</form>
				</div>
				<Separator />
				<div className="mt-5">
					<Tabs defaultValue="account" className="w-full">
						<div className="px-2">
							<TabsList className="h-fit w-full rounded-md bg-[#f0f0f0] px-[3px]">
								<TabsTrigger
									className="w-full rounded-[6px] py-1 text-[12px] font-normal hover:bg-[#e3e3e3] focus:font-bold"
									value="account"
								>
									Input
								</TabsTrigger>
								<TabsTrigger
									className="w-full rounded-[6px] py-1 text-[12px] font-normal hover:bg-[#e3e3e3] focus:font-bold"
									value="password"
								>
									Output
								</TabsTrigger>
							</TabsList>
						</div>

						<TabsContent value="account" className="mt-4">
							<Accordion id="1" type="single" defaultValue="item-1" collapsible>
								<AccordionItem value="item-1">
									<AccordionTrigger style={{ textDecoration: 'none' }} className="px-4 text-xs">
										Elementary Exchange
									</AccordionTrigger>
									<AccordionContent>
										<ScrollableList className="h-full space-y-2 overflow-scroll p-2" data={elementaryExchangeInput}>
											{elementaryExchangeInput.length > 0 ? (
												elementaryExchangeInput.map((item) => <ExchangeItem isInput data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No elementary</div>
											)}
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
												className="ml-auto mr-2 flex h-fit items-center space-x-1 rounded-sm px-2.5 py-1.5"
												aria-label="Add a new exchange entry"
											>
												<Button variant={'ghost'}>
													<Plus size={20} />
													<span className="text-[13px] font-semibold">Add elementary</span>
												</Button>
											</DialogTrigger>
										</ScrollableList>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Accordion id="2" type="single" collapsible>
								<AccordionItem value="item-1">
									<AccordionTrigger style={{ textDecoration: 'none' }} className="px-4 text-xs">
										Product Exchange
									</AccordionTrigger>
									<AccordionContent>
										<ScrollableList className="h-full space-y-3 overflow-scroll p-2" data={productExchangeInput}>
											{productExchangeInput.length > 0 ? (
												productExchangeInput.map((item) => <ProductItem data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No product input</div>
											)}
											<Button
												variant={'ghost'}
												disabled={addNewProductExchangeMutate.isPending}
												onClick={() => handleAddNewProductOutput({ input: true })}
												className="ml-auto mr-2 flex h-fit items-center space-x-1 rounded-sm px-2.5 py-1.5"
											>
												<Package size={20} />
												<span className="text-[13px] text-xs font-semibold">
													{addNewProductExchangeMutate.isPending ? 'Adding...' : 'New Product'}
												</span>
											</Button>
										</ScrollableList>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</TabsContent>
						<TabsContent value="password" className="mt-4">
							<Accordion id="3" type="single" defaultValue="item-3" collapsible>
								<AccordionItem value="item-3">
									<AccordionTrigger style={{ textDecoration: 'none' }} className="px-4 text-xs">
										Elementary Exchange
									</AccordionTrigger>
									<AccordionContent>
										<ScrollableList className="h-full space-y-2 overflow-scroll p-2" data={elementaryExchangeOutput}>
											{elementaryExchangeOutput.length > 0 ? (
												elementaryExchangeOutput.map((item) => <ExchangeItem isInput={false} data={item} key={item.id} />)
											) : (
												<div className="flex h-full items-center justify-center text-sm">No elementary</div>
											)}
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
												className="ml-auto mr-2 flex h-fit items-center space-x-1 rounded-sm px-2.5 py-1.5"
												aria-label="Add a new exchange entry"
											>
												<Button variant={'ghost'}>
													<Plus size={20} />
													<span className="text-[13px] font-semibold">Add elementary</span>
												</Button>
											</DialogTrigger>
										</ScrollableList>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
							<Accordion id="4" type="single" collapsible>
								<AccordionItem value="item-4">
									<AccordionTrigger style={{ textDecoration: 'none' }} className="px-4 text-xs">
										Product Exchange
									</AccordionTrigger>
									<AccordionContent>
										<div className="h-full w-full space-y-3 p-2">
											{productExchangeOutput ? (
												<ProductItem data={productExchangeOutput} />
											) : (
												<div className="flex h-full items-center justify-center text-sm">Not product</div>
											)}
										</div>
										<Button
											variant={'ghost'}
											disabled={addNewProductExchangeMutate.isPending || productExchangeOutput !== undefined}
											onClick={() => handleAddNewProductOutput({ input: false })}
											className="ml-auto mr-2 flex h-fit items-center space-x-1 rounded-sm px-4 py-1.5"
										>
											<Package size={20} />
											<span className="text-[13px] text-xs font-semibold">
												{addNewProductExchangeMutate.isPending ? 'Adding...' : 'New Product'}
											</span>
										</Button>
									</AccordionContent>
								</AccordionItem>
							</Accordion>
						</TabsContent>
					</Tabs>
				</div>
			</div>
			<DialogContent className="border-none p-0 shadow-2xl [&>button]:hidden" style={{ maxWidth: 670, width: 670, borderRadius: 16 }}>
				<SheetbarSearch />
			</DialogContent>
			<DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
		</Dialog>
	);
}

export default React.memo(SheetbarSide);
