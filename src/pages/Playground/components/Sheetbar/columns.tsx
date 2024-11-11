/* eslint-disable react-hooks/rules-of-hooks */
import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Exchange, Unit } from '@/@types/exchange.type';
import { ExchangeApis } from '@/apis/exchange.apis';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SheetbarContext } from '@/pages/Playground/contexts/sheetbar.context';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Node, useReactFlow } from '@xyflow/react';
import { Check, Trash2 } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

export const columns: ColumnDef<Exchange>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		size: 50,
		cell: ({ row }) => {
			const { sheetDispatch } = useContext(SheetbarContext);
			const value = row.getValue<string>('name');
			useEffect(() => {
				sheetDispatch({
					type: SheetBarDispatch.SET_EXCHANGE,
					payload: {
						id: row.original.id,
						initialValue: row.original.value,
						initUnit: row.original.unit,
						value: row.original.value,
						unit: row.original.unit,
						isUpdate: false,
					},
				});
			}, [sheetDispatch, row.original]);

			return (
				<div className="flex flex-col">
					<div>{value}</div>
					<div className="text-xs text-gray-400">{row.original.emissionSubstance.emissionCompartment.name}</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
		size: 20,
		cell: ({ row }) => {
			const initialValue = row.getValue<number>('value');
			const { sheetState, sheetDispatch } = useContext(SheetbarContext);

			// Truy xuất giá trị exchange từ sheetState cho từng dòng
			const exchange = sheetState.exchanges.find((item) => item.id === row.original.id);

			// Khởi tạo state để lưu trữ giá trị
			const [valueExchange, setValueExchange] = useState<string>(exchange?.value ? String(exchange.value) : String(initialValue));

			// Cập nhật khi `exchange.value` thay đổi
			useEffect(() => {
				if (exchange?.value !== undefined) {
					setValueExchange(String(exchange.value));
				}
			}, [exchange?.value]);

			console.log('123');

			// Xử lý thay đổi giá trị
			const handleChangeValueExchange = (event: React.ChangeEvent<HTMLInputElement>) => {
				const { value } = event.target;
				const newValue = value === '' ? '0' : value; // Mặc định là "0" khi rỗng

				if (/^\d+(\.\d+)?$/.test(newValue) || newValue === '0') {
					setValueExchange(newValue);
					sheetDispatch({
						type: SheetBarDispatch.SET_EXCHANGE,
						payload: {
							id: row.original.id,
							initialValue: initialValue,
							value: Number(newValue),
						},
					});
				}
			};

			// Sanitize giá trị input
			const sanitizerInputValue = () => {
				if (valueExchange.length > 1 && valueExchange.startsWith('0')) {
					const newValue = valueExchange.slice(1);
					setValueExchange(newValue);
				}
			};

			return (
				<div className="w-fit">
					<input
						type="number"
						value={valueExchange}
						onBlur={sanitizerInputValue}
						onChange={handleChangeValueExchange}
						className="no-arrows w-full rounded border-[1.5px] p-0.5"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'unit',
		header: 'Unit',
		size: 20,

		cell: ({ row }) => {
			const { sheetState, sheetDispatch } = useContext(SheetbarContext);
			const exchange = sheetState.exchanges.find((item) => item.id === row.original.id);

			const data = row.getValue<Unit>('unit');
			const { data: unit } = useQuery({
				queryKey: ['unit-group', data.unitGroup.id],
				queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
			});

			const handleChangeUnit = ({ unit }: { unit: Unit }) => {
				const upcomingFactor = unit.conversionFactor;
				const currentFactor = row.original.unit.conversionFactor || 1; // The initial unit's conversion factor

				// Ensure valid conversion factors to avoid division errors
				if (!upcomingFactor || upcomingFactor === 0) {
					console.error('Invalid conversion factor:', { upcomingFactor });
					return;
				}

				// Use initialValue as the base for recalculations
				const calculatedValue = row.original.value * (currentFactor / upcomingFactor);

				sheetDispatch({
					type: SheetBarDispatch.SET_EXCHANGE,
					payload: {
						id: row.original.id,
						unit,
						initUnit: row.original.unit, // Keep the baseline initial unit
						value: calculatedValue,
					},
				});
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="px-3 py-1 text-sm">
							{exchange?.unit?.name}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[270px] p-0">
						<div className="relative h-[300px] overflow-y-auto scroll-smooth bg-white">
							<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold">
								<div className="col-span-4">Unit</div>
								<div className="col-span-5">Value</div>
								<div className="col-span-3">Default</div>
							</div>
							<div className="z-10 p-2">
								{unit?.data.data.map((item, index) => {
									return (
										<DropdownMenuItem
											onClick={() => handleChangeUnit({ unit: item })}
											key={index}
											className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 transition-all duration-150 hover:bg-gray-50"
										>
											<div className="col-span-4 text-sm font-semibold text-gray-700">{item.name}</div>
											<div className="col-span-5 text-sm text-gray-600">= {item.conversionFactor}</div>
											<div className="col-span-3 text-right text-sm text-gray-500">{row.original.unit.name}</div>
										</DropdownMenuItem>
									);
								})}
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		id: 'actions',
		size: 10,
		cell: ({ row }) => {
			const id = row.original.id;
			const { sheetState, sheetDispatch } = useContext(SheetbarContext);
			const exchange = sheetState.exchanges.find((item) => item.id === id);
			const { setNodes } = useReactFlow<Node<CabonerfNodeData>>();

			const deleteExchangeMutations = useMutation({
				mutationFn: (id: string) => ExchangeApis.prototype.deleteElementaryExchange({ id }),
			});

			const updateExchangeMutation = useMutation({
				mutationFn: ({ id, payload }: { id: string; payload: { processId: string; unitId: string; value: number } }) =>
					ExchangeApis.prototype.updateElementaryExchange(id, payload),
			});

			const handleDeleteExchange = () => {
				deleteExchangeMutations.mutate(id, {
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

			const handleUpdateExchange = () => {
				updateExchangeMutation.mutate(
					{
						id: row.original.id,
						payload: {
							processId: sheetState.process?.id as string,
							unitId: exchange?.unit?.id as string,
							value: exchange?.value as number,
						},
					},
					{
						onSuccess: (data) => {
							const newProcess = data.data.data;
							toast('UPDATE OKE ROI MINH OI');

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
					}
				);
			};

			return (
				<div className="flex justify-between space-x-2">
					<div className="min-w-[24px]">
						{exchange?.isUpdate && (
							<button
								onClick={() => handleUpdateExchange()}
								className="flex items-center space-x-1 rounded bg-red-50 p-1"
								disabled={deleteExchangeMutations.isPending}
							>
								{updateExchangeMutation.isPending ? (
									<ReloadIcon className="h-4 w-4 animate-spin p-0.5" color="green" />
								) : (
									<Check size={17} color="green" />
								)}
							</button>
						)}
					</div>

					<button
						className="flex items-center space-x-1 rounded bg-red-50 p-1"
						disabled={deleteExchangeMutations.isPending}
						onClick={handleDeleteExchange}
					>
						{deleteExchangeMutations.isPending ? (
							<ReloadIcon className="h-4 w-4 animate-spin p-0.5" color="red" />
						) : (
							<Trash2 size={17} color="red" />
						)}
					</button>
				</div>
			);
		},
	},
];
