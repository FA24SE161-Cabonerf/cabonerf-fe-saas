import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import clsx from 'clsx';
import { Check, CloudOff, Leaf, Trash2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

type Props = {
	data: Exchange;
	isInput?: boolean;
};

function ExchangeItem({ data, isInput }: Props) {
	const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();
	const { sheetState, sheetDispatch } = useContext(SheetbarContext);
	const [unitExchange, setUnitExchange] = useState<Unit>(data.unit);
	const [valueExchange, setValueExchange] = useState<string>(String(data.value));
	const [isUpdate, setIsUpdate] = useState<boolean>(false);

	const { data: unit } = useQuery({
		queryKey: ['unit-group', data.unit.unitGroup.id],
		queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
	});

	const deleteExchangeMutations = useMutation({
		mutationFn: (id: string) => ExchangeApis.prototype.deleteElementaryExchange({ id }),
	});

	const updateExchangeMutation = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { processId: string; unitId: string; value: number } }) =>
			ExchangeApis.prototype.updateElementaryExchange(id, payload),
	});

	useEffect(() => {
		const currentValue = Number(valueExchange);
		const currentUnit = unitExchange;

		// Kiểm tra nếu giá trị hoặc đơn vị đã thay đổi từ base
		const isValueChanged = data.value !== currentValue;
		const isUnitChanged = data.unit.id !== currentUnit.id;

		// Đặt isUpdate thành true nếu một trong hai hoặc cả hai thay đổi
		setIsUpdate(isValueChanged || isUnitChanged);
	}, [data.unit.id, data.value, unitExchange, valueExchange]);

	const handleChangeValueExchange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const newValue = value === '' ? '0' : value;

		const sanitizedValue = newValue.replace(/^0+(?=\d)/, '');

		if (/^\d+(\.\d+)?$/.test(sanitizedValue) || sanitizedValue === '0') {
			setValueExchange(sanitizedValue);
		}
	};

	const handleChangeUnit = ({ unit }: { unit: Unit }) => {
		// Use initialValue as the base for recalculations
		const calculatedValue = data.value * (data.unit.conversionFactor / unit.conversionFactor);

		setValueExchange(String(calculatedValue));
		setUnitExchange(unit);
	};

	const handleDeleteExchange = () => {
		deleteExchangeMutations.mutate(data.id, {
			onSuccess: (data) => {
				const newData = data.data.data;

				setNodes((nodes) => {
					return nodes.map((node) => {
						if (node.id === sheetState.process?.id) {
							const updateExchanges = node.data.exchanges.filter((item) => {
								if (item.id !== newData.exchange.id) {
									return item;
								}
							});

							const newProcess: Node<CabonerfNodeData> = {
								...node,
								data: {
									...node.data,
									exchanges: updateExchanges,
									impacts: newData.impacts,
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
									impacts: newProcess.data.impacts,
									exchanges: newProcess.data.exchanges,
									lifeCycleStage: sheetState.process.lifeCycleStage,
								},
							});

							return newProcess;
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

	const handleUpdateExchange = () => {
		updateExchangeMutation.mutate(
			{
				id: data.id,
				payload: {
					processId: sheetState.process?.id as string,
					unitId: unitExchange.id,
					value: Number(valueExchange),
				},
			},
			{
				onSuccess: (data) => {
					const newData = data.data.data;

					setNodes((nodes) => {
						return nodes.map((node) => {
							if (node.id === sheetState.process?.id) {
								const updateExchanges = node.data.exchanges.map((item) =>
									item.id === newData.exchange.id ? newData.exchange : item
								);

								const newProcess: Node<CabonerfNodeData> = {
									...node,
									data: {
										...node.data,
										exchanges: updateExchanges,
										impacts: newData.impacts,
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
										impacts: newProcess.data.impacts,
										exchanges: newProcess.data.exchanges,
										lifeCycleStage: sheetState.process.lifeCycleStage,
									},
								});

								return newProcess;
							}
							return node;
						});
					});
				},
			}
		);
	};

	return (
		<div className="relative rounded-md border-[0.5px] border-gray-200 bg-white px-4 py-1 shadow-sm">
			<div className="before-exchange-substance before:bg-gray-200" />
			{/* Name */}
			<div className="flex items-center justify-between space-x-2">
				<div className="flex w-[60%] max-w-[60%] items-center space-x-3">
					<div className="rounded-sm bg-white p-1 shadow shadow-primary-green">
						{isInput ? <Leaf size={22} fill="#166534" color="white" /> : <CloudOff size={21} color="#166534" fill="#166534" />}
					</div>

					<div className="flex flex-col">
						<div className="break-all text-[12px]">{data.name}</div>
						<div className="text-xs text-gray-500">{data.emissionSubstance.emissionCompartment.name}</div>
					</div>
				</div>

				<div className="flex w-[30%] min-w-[30%] space-x-1 rounded-sm">
					<input
						type="text"
						id={`value3${data.id}`}
						value={valueExchange}
						onChange={handleChangeValueExchange}
						className="z-40 w-[60%] min-w-[60%] rounded-[8px] bg-[#f0f0f0] px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-green-700"
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
									{unit?.data.data.map((item, index) => (
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
											<div className="col-span-5 text-gray-600">= {item.conversionFactor / unitExchange.conversionFactor}</div>
											<div className="col-span-3 text-right text-gray-500">{unitExchange.name}</div>
										</DropdownMenuItem>
									))}
								</div>
							</div>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className="flex w-[20%] justify-end space-x-2">
					{isUpdate ? (
						<button
							onClick={() => handleUpdateExchange()}
							className="flex items-center justify-center rounded-sm bg-green-100 p-1.5 transition duration-150 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
							disabled={updateExchangeMutation.isPending}
							aria-label="Update Exchange"
						>
							{updateExchangeMutation.isPending ? (
								<ReloadIcon className="h-4 w-4 animate-spin text-green-600" />
							) : (
								<Check className="h-4 w-4 text-green-600" />
							)}
						</button>
					) : (
						<button
							onClick={handleDeleteExchange}
							className="flex items-center justify-center rounded-sm bg-red-100 p-1.5 transition duration-150 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
							disabled={deleteExchangeMutations.isPending}
							aria-label="Delete Exchange"
						>
							{deleteExchangeMutations.isPending ? (
								<ReloadIcon className="h-4 w-4 animate-spin text-red-600" />
							) : (
								<Trash2 className="h-4 w-4 text-red-600" />
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default React.memo(ExchangeItem);
