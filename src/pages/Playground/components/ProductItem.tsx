import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { UnitApis } from '@/apis/unit.apis';
import ErrorSooner from '@/components/ErrorSooner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useDeleteHandle from '@/hooks/useDeleteHandle';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { isUnprocessableEntity } from '@/utils/error';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { Check, ChevronLeft, Trash2 } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	data: Exchange;
	isInput: boolean;
};

type ItemConnector = {
	id: string;
	name: string;
	bg: string;
};

export default function ProductItem({ isInput, data }: Props) {
	const deleteHandle = useDeleteHandle();
	const { setNodes, fitView, getEdges, getNode, getNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);

	const [unitExchange, setUnitExchange] = useState<Unit>(data.unit);
	const [valueExchange, setValueExchange] = useState<string>(String(data.value));
	const [nameProduct, setNameProduct] = useState<string>(data.name);
	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const [defaultUnitGroup, setDefaultUnitGroup] = useState<string>(data.unit.unitGroup.id);

	const { data: unitGroup } = useQuery({
		queryKey: ['unit-groups'],
		queryFn: UnitApis.prototype.getAllUnitGroup,
		staleTime: 1_000 * 60 * 60,
	});

	const { data: unit } = useQuery({
		queryKey: ['unit-group', defaultUnitGroup],
		queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
	});

	const updateProductExchangeMutate = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { processId: string; unitId: string; value: number; name: string } }) =>
			ExchangeApis.prototype.updateProductExchange(id, payload),
	});

	useEffect(() => {
		setIsUpdate(data.value !== Number(valueExchange) || nameProduct !== data.name || unitExchange.id !== data.unit.id);
	}, [data.name, data.unit.id, data.value, nameProduct, unitExchange.id, valueExchange]);

	const handleChangeValueExchange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;

		const newValue = value === '' ? '0' : value;

		const sanitizedValue = newValue.replace(/^0+(?=\d)/, '');

		if (/^\d*(\.\d*)?$/.test(sanitizedValue)) {
			setValueExchange(sanitizedValue);
		}
	};

	const getItemConnectors = useMemo((): ItemConnector | ItemConnector[] => {
		const edges = getEdges();
		const nodes = getNodes();

		if (isInput) {
			// Handle the case for input connectors
			const getTarget = edges.find((item) => item.targetHandle === data.id);
			if (getTarget) {
				const sourceNode = getNode(getTarget.source);
				return {
					id: sourceNode?.id ?? '',
					name: sourceNode?.data.name ?? 'defaultName',
					bg: sourceNode?.data.color ?? '#cecece',
				};
			}
		} else {
			// Handle the case for output connectors
			const getSource = edges.filter((item) => item.sourceHandle === data.id);
			if (getSource.length > 0) {
				const listNode: ItemConnector[] = nodes
					.map((node) => {
						const sourceEdge = getSource.find((edge) => edge.target === node.id);
						if (sourceEdge) {
							return {
								id: node.id ?? '',
								name: node.data.name ?? 'defaultName',
								bg: node.data.color ?? '#cecece',
							};
						}
						return null; // Exclude nodes without matching edges
					})
					.filter((item): item is ItemConnector => item !== null); // Remove null entries
				return listNode;
			}
		}

		// Default return value if no connectors are found
		return {
			id: 'DEFAULT_VALUE_FOR_NOTHING_ZZ!@#A',
			name: '',
			bg: '#cecece',
		};
	}, [data.id, getEdges, getNode, getNodes, isInput]);

	const handleChangeUnit = ({ unit }: { unit: Unit }) => {
		// Use initialValue as the base for recalculations
		const calculatedValue = data.value * (data.unit.conversionFactor / unit.conversionFactor);

		setValueExchange(String(calculatedValue));
		setUnitExchange(unit);
	};

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setNameProduct(value);
	};

	const handleDeleteExchange = () => {
		deleteHandle.mutate(data.id);
	};

	const handleUpdateProduct = () => {
		updateProductExchangeMutate.mutate(
			{
				id: data.id,
				payload: {
					processId: sheetState.process?.id as string,
					unitId: unitExchange.id,
					value: Number(valueExchange),
					name: nameProduct,
				},
			},
			{
				onSuccess: (data) => {
					const newProcess = data.data.data; //{processId: string, exchange: Exchange}[]
					const newExchangesMap = new Map(newProcess.map((ex) => [ex.processId, ex.exchange]));

					setNodes((nodes) => {
						return nodes.map((node) => {
							if (newExchangesMap.has(node.id)) {
								const newExchange = newExchangesMap.get(node.id);

								const updateExchange = (node.data.exchanges as Exchange[]).map((ex) => {
									if (ex.id === newExchange?.id) {
										return newExchange;
									}
									return ex;
								});

								const _newProcess = {
									...node,
									data: {
										...node.data,
										exchanges: updateExchange,
									},
								};

								if (node.id === sheetState.process?.id) {
									sheetDispatch({
										type: SheetBarDispatch.SET_NODE,
										payload: {
											id: _newProcess.id,
											color: _newProcess.data.color,
											description: _newProcess.data.description,
											exchanges: _newProcess.data.exchanges,
											impacts: _newProcess.data.impacts,
											bgColor: _newProcess.data.bgColor,
											lifeCycleStage: _newProcess.data.lifeCycleStage,
											name: _newProcess.data.name,
											overallProductFlowRequired: _newProcess.data.overallProductFlowRequired,
											projectId: _newProcess.data.projectId,
											library: _newProcess.data.library, // Add this line
										},
									});
								}
								return _newProcess;
							}
							return node;
						});
					});
				},
				onError: (err) => {
					if (isUnprocessableEntity<{ data: null; message: string; status: string }>(err)) {
						setNameProduct(data.name);
						toast(<ErrorSooner message={err.response?.data.message ?? ''} />, {
							className: 'rounded-2xl p-1.5 ',
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

	const handleViewNode = (id: string) => {
		fitView({
			nodes: [{ id: id }],
			duration: 1100,
			minZoom: 2,
			maxZoom: 2,
		});
	};

	const defaultUnit = useMemo(() => {
		return unit?.data.data.find((item) => item.isDefault)?.name;
	}, [unit?.data.data]);

	return (
		<div className="relative flex flex-col rounded-md px-4">
			{/* Name */}
			<TooltipProvider delayDuration={200}>
				{isInput && (
					<div className="relative mb-2.5">
						<div className="absolute -left-4 top-1/2 z-50 size-2 -translate-y-1/2 rounded-full border border-gray-300 bg-white" />
						<div className="absolute -left-[12.5px] top-1/2 z-10 h-[40px] w-[20px] rounded-bl-xl border-[1px] border-r-0 border-t-0 border-gray-300" />

						<Tooltip>
							<TooltipTrigger
								onClick={() =>
									(getItemConnectors as ItemConnector).id !== 'DEFAULT_VALUE_FOR_NOTHING_ZZ!@#A' &&
									handleViewNode((getItemConnectors as ItemConnector).id)
								}
								id={(getItemConnectors as ItemConnector).id}
								asChild
							>
								<div
									style={{ color: (getItemConnectors as ItemConnector).bg }}
									className="w-fit cursor-pointer rounded-[6px] bg-gray-50 px-2 py-1 text-xs font-medium hover:bg-gray-100"
								>
									Process:{' '}
									{(getItemConnectors as ItemConnector).name === 'empty' ? <></> : (getItemConnectors as ItemConnector).name}
								</div>
							</TooltipTrigger>
							<TooltipContent className="flex flex-col font-medium" id={(getItemConnectors as ItemConnector).id}>
								<div>Process: {(getItemConnectors as ItemConnector).name}</div>
								<div className="text-[10px] font-normal">
									{(getItemConnectors as ItemConnector).id === 'DEFAULT_VALUE_FOR_NOTHING_ZZ!@#A'
										? `Drag to another process`
										: `Click to view this node`}
								</div>
							</TooltipContent>
						</Tooltip>
					</div>
				)}

				<div className="relative z-30 flex justify-between space-x-1 rounded-md bg-[#f0f0f0] p-[3px]">
					<div className="relative flex w-[65%] max-w-[65%]">
						<input
							className="w-full max-w-full break-all rounded-[6px] bg-[#f0f0f0] px-2 text-[12px] font-medium outline-none transition-all focus:bg-white"
							value={nameProduct}
							id={`name2${data.id}`}
							onChange={handleChangeName}
						/>
						{isInput === false && (
							<div className="absolute -left-[18px] top-1/2 z-10 size-2 -translate-y-1/2 rounded-full border border-gray-300 bg-white" />
						)}
					</div>
					<div className="flex w-[30%] min-w-[30%] items-center space-x-0.5">
						<input
							type="text"
							id={`value2${data.id}`}
							value={valueExchange}
							onChange={handleChangeValueExchange}
							className="z-40 h-fit w-[50%] min-w-[50%] rounded bg-[#e3e2e2] px-2 py-1.5 text-xs outline-none transition-all focus:bg-white"
						/>

						<DropdownMenu>
							<DropdownMenuTrigger className="ml-3 min-w-[60px] rounded-[8px] bg-[#f0f0f0] p-1 text-xs font-semibold">
								{unitExchange.name}
							</DropdownMenuTrigger>

							<DropdownMenuContent className="mr-4 w-[270px] rounded-[8px] border p-0 shadow-lg">
								<div className="relative h-[300px] overflow-y-auto scroll-smooth bg-white">
									<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
										<div className="col-span-4">Unit</div>
										<div className="col-span-5">Value</div>
										<div className="col-span-3 text-right">Default</div>
									</div>
									<div className="p-2">
										{unit?.data.data.map((item, index) => {
											return (
												<DropdownMenuItem
													onClick={() => handleChangeUnit({ unit: item })}
													key={index}
													className={clsx(
														`grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 text-xs text-gray-600 transition-all duration-150 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none`,
														{
															'rounded-sm bg-gray-100': data.unit.id === item.id,
														}
													)}
													aria-label={`Select unit ${item.name}`}
												>
													<div className="col-span-4 font-medium text-gray-700">{item.name}</div>
													<div className="col-span-5 text-gray-600">
														= {item.conversionFactor / unitExchange.conversionFactor}
													</div>
													<div className="col-span-3 text-right text-gray-500">{defaultUnit}</div>
												</DropdownMenuItem>
											);
										})}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger className="mx-auto mb-1 flex items-center justify-between rounded px-3 py-1 hover:bg-[#f0f0f0]">
											<ChevronLeft size={15} />
											<div className="text-[13px]">Select unit group</div>
										</DropdownMenuTrigger>

										<DropdownMenuContent side="left">
											<DropdownMenuLabel className="text-[13px]">Select unit group</DropdownMenuLabel>
											{unitGroup?.data.data.map((unit_group) => (
												<DropdownMenuItem key={unit_group.id} onClick={() => setDefaultUnitGroup(unit_group.id)}>
													<div className="col-span-4 font-medium text-gray-700">{unit_group.name}</div>
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex w-[20%] items-center justify-end space-x-2">
						{isUpdate ? (
							<button
								onClick={() => handleUpdateProduct()}
								className="mr-1 flex items-center justify-center rounded-sm p-1.5 transition duration-150 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
								disabled={updateProductExchangeMutate.isPending}
								aria-label="Update Exchange"
							>
								{updateProductExchangeMutate.isPending ? (
									<ReloadIcon className="h-4 w-4 animate-spin text-green-600" />
								) : (
									<Check className="h-4 w-4 text-green-600" />
								)}
							</button>
						) : (
							<button
								onClick={handleDeleteExchange}
								className="mr-1 flex h-fit items-center justify-center rounded-sm p-1.5 transition duration-150 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
								disabled={deleteHandle.isPending}
								aria-label="Delete Exchange"
							>
								{deleteHandle.isPending ? (
									<ReloadIcon className="h-4 w-4 animate-spin text-red-600" />
								) : (
									<Trash2 className="h-4 w-4 text-red-600" />
								)}
							</button>
						)}
					</div>
					{isInput === false && (getItemConnectors as ItemConnector[]).length > 0 && (
						<>
							{(getItemConnectors as ItemConnector[]).map((item, index, length) => (
								<div key={item.id} className="">
									<div
										className={`absolute h-[45px] w-[120px] max-w-[300px] overflow-visible border-[1px] border-r-0 border-t-0 border-gray-300`}
										style={{
											top: `${60 + index * 100}%`, // Dynamically calculate the `top` value
											left: '-11.5px',
											borderBottomLeftRadius: index === length.length - 1 ? 12 : 0,
										}}
									>
										<Tooltip>
											<TooltipTrigger onClick={() => handleViewNode(item.id)} id={item.id} asChild>
												<div
													className="absolute -bottom-2.5 -right-16 z-20 w-[150px] cursor-pointer overflow-hidden truncate whitespace-nowrap rounded-[6px] bg-gray-50 px-2 py-1 text-xs font-medium hover:bg-gray-100"
													style={{
														maxWidth: '280px', // Giới hạn chiều rộng của văn bản
														color: item.bg,
													}}
												>
													Process: {item.name}
												</div>
											</TooltipTrigger>
											<TooltipContent className="flex flex-col font-medium" id={item.id}>
												<div>Process: {item.name}</div>
												<div className="text-[10px] font-normal">Click to view this node</div>
											</TooltipContent>
										</Tooltip>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</TooltipProvider>
			{isInput === false &&
				(getItemConnectors as ItemConnector[]).length > 0 &&
				(getItemConnectors as ItemConnector[]).map((item) => <div key={item.id} className="h-[35px]"></div>)}
		</div>
	);
}
