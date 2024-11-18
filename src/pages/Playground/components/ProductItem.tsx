import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { UnitApis } from '@/apis/unit.apis';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useDeleteHandle from '@/hooks/useDeleteHandle';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Node, useReactFlow } from '@xyflow/react';
import { Check, ChevronLeft, Package, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';

type Props = {
	data: Exchange;
};

export default function ProductItem({ data }: Props) {
	const deleteHandle = useDeleteHandle();
	const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();
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

	const { data: unit, isFetching: isFetchingUnit } = useQuery({
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

		if (/^\d+(\.\d+)?$/.test(sanitizedValue) || sanitizedValue === '0') {
			setValueExchange(sanitizedValue);
		}
	};

	const handleChangeUnit = ({ unit }: { unit: Unit }) => {
		// Use initialValue as the base for recalculations
		const calculatedValue = data.value * (unit.conversionFactor / data.unit.conversionFactor);

		setValueExchange(String(calculatedValue));
		setUnitExchange(unit);
	};

	const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		setNameProduct(value);
	};

	const handleDeleteExchange = () => {
		deleteHandle.mutate(data.id);
		// deleteExchangeMutations.mutate(data.id, {
		// 	onSuccess: (data) => {
		// 		const newProductExchanges = data.data.data;

		// 		setNodes((nodes) => {
		// 			return nodes.map((node) => {
		// 				if (node.id === sheetState.process?.id) {
		// 					const _newProcess = {
		// 						...node,
		// 						data: { ...node.data, exchanges: newProductExchanges },
		// 					};

		// 					sheetDispatch({
		// 						type: SheetBarDispatch.SET_NODE,
		// 						payload: {
		// 							id: _newProcess.id,
		// 							color: _newProcess.data.color,
		// 							description: _newProcess.data.description,
		// 							exchanges: _newProcess.data.exchanges,
		// 							impacts: _newProcess.data.impacts,
		// 							lifeCycleStage: _newProcess.data.lifeCycleStage,
		// 							name: _newProcess.data.name,
		// 							overallProductFlowRequired: _newProcess.data.overallProductFlowRequired,
		// 							projectId: _newProcess.data.projectId,
		// 						},
		// 					});
		// 					return _newProcess;
		// 				}
		// 				return node;
		// 			});
		// 		});
		// 	},
		// 	onError: (error) => {
		// 		toast(error.message);
		// 	},
		// });
	};

	const handleUpdateProduct = () => {
		console.log({
			processId: sheetState.process?.id as string,
			unitId: unitExchange.id,
			value: Number(valueExchange),
			name: nameProduct,
		});
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

								const updateExchange = node.data.exchanges.map((ex) => {
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
											lifeCycleStage: _newProcess.data.lifeCycleStage,
											name: _newProcess.data.name,
											overallProductFlowRequired: _newProcess.data.overallProductFlowRequired,
											projectId: _newProcess.data.projectId,
										},
									});
								}
								return _newProcess;
							}
							return node;
						});
					});
				},
			}
		);
	};

	return (
		<div className="relative rounded-md border border-gray-200 px-4 py-2.5">
			<div className="exchange-substance before:bg-gray-200" />
			{/* Name */}
			<div className="flex items-center justify-between space-x-2">
				<div className="flex w-[70%] max-w-[70%] space-x-3">
					<div className="rounded-sm border bg-white p-1 shadow">
						<Package size={22} fill="white" color="#166534" />
					</div>

					<input
						className="w-full max-w-full self-stretch break-all rounded-[8px] bg-[#f0f0f0] px-2 py-0.5 text-sm font-medium outline-green-700"
						value={nameProduct}
						onChange={handleChangeName}
					/>
				</div>

				<div className="flex w-[30%] min-w-[30%] rounded-sm">
					<input
						type="text"
						value={valueExchange}
						onChange={handleChangeValueExchange}
						className="z-50 w-[60%] min-w-[60%] rounded-[8px] bg-[#f0f0f0] px-2 py-2 text-xs outline-[0.5px] outline-green-700"
					/>
					<DropdownMenu>
						<DropdownMenuTrigger className="ml-3 min-w-[60px] rounded-[8px] bg-[#f0f0f0] p-1 text-xs font-semibold">
							{unitExchange.name}
						</DropdownMenuTrigger>

						<DropdownMenuContent className="w-[270px] rounded-md border border-gray-200 p-0 shadow-lg">
							<div className="relative h-[300px] overflow-y-auto scroll-smooth bg-white">
								<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
									<div className="col-span-4">Unit</div>
									<div className="col-span-5">Value</div>
									<div className="col-span-3 text-right">Default</div>
								</div>
								<div className="p-2">
									{isFetchingUnit ? (
										<div>Loading</div>
									) : (
										unit?.data.data.map((item, index) => (
											<DropdownMenuItem
												onClick={() => handleChangeUnit({ unit: item })}
												key={index}
												className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 text-sm text-gray-600 transition-all duration-150 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
												aria-label={`Select unit ${item.name}`}
											>
												<div className="col-span-4 font-medium text-gray-700">{item.name}</div>
												<div className="col-span-5 text-gray-600">= {item.conversionFactor}</div>
												<div className="col-span-3 text-right text-gray-500">{unitExchange.name}</div>
											</DropdownMenuItem>
										))
									)}
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

				<div className="flex w-[20%] justify-end space-x-2">
					{isUpdate ? (
						<button
							onClick={() => handleUpdateProduct()}
							className="flex items-center justify-center rounded-sm bg-green-100 p-1.5 transition duration-150 ease-in-out hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
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
							className="flex items-center justify-center rounded-sm bg-red-100 p-1.5 transition duration-150 ease-in-out hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
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
			</div>
		</div>
	);
}
