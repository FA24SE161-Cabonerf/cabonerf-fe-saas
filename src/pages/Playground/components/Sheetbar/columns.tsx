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
		size: 250,
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
				<div className="flex w-[250px] min-w-[250px] flex-col space-y-1 rounded-md">
					<div className="text-base font-medium text-gray-800">{value}</div>
					<div className="text-xs text-gray-500">{row.original.emissionSubstance.emissionCompartment.name}</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
		size: 100,
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

				const sanitizedValue = newValue.replace(/^0+(?=\d)/, '');

				if (/^\d+(\.\d+)?$/.test(sanitizedValue) || sanitizedValue === '0') {
					setValueExchange(sanitizedValue);
					sheetDispatch({
						type: SheetBarDispatch.SET_EXCHANGE,
						payload: {
							id: row.original.id,
							initialValue: initialValue,
							value: Number(sanitizedValue),
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
				<div className="w-[100px] min-w-[100px]">
					<input
						type="number"
						value={valueExchange}
						onBlur={sanitizerInputValue}
						onChange={handleChangeValueExchange}
						className="no-arrows w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-700 placeholder-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
						placeholder="Enter value"
					/>
				</div>
			);
		},
	},
	{
		accessorKey: 'unit',
		header: () => <div className="text-center">Unit</div>,
		size: 100,

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
						<Button
							variant="ghost"
							className="w-[100px] min-w-[100px] px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
							aria-label="Select unit"
						>
							{exchange?.unit?.name}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-[270px] rounded-md border border-gray-200 p-0 shadow-lg">
						<div className="relative h-[300px] overflow-y-auto scroll-smooth bg-white">
							<div className="sticky top-0 z-20 grid grid-cols-12 rounded-t-md border-b border-gray-200 bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
								<div className="col-span-4">Unit</div>
								<div className="col-span-5">Value</div>
								<div className="col-span-3 text-right">Default</div>
							</div>
							<div className="p-2">
								{unit?.data.data.map((item, index) => (
									<DropdownMenuItem
										onClick={() => handleChangeUnit({ unit: item })}
										key={index}
										className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 text-sm text-gray-600 transition-all duration-150 hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
										aria-label={`Select unit ${item.name}`}
									>
										<div className="col-span-4 font-medium text-gray-700">{item.name}</div>
										<div className="col-span-5 text-gray-600">= {item.conversionFactor}</div>
										<div className="col-span-3 text-right text-gray-500">{row.original.unit.name}</div>
									</DropdownMenuItem>
								))}
							</div>
						</div>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
	{
		id: 'actions',
		size: 50,
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
				<div className="flex w-[50px] max-w-[50px] justify-end space-x-1">
					{exchange?.isUpdate && (
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
					)}

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
				</div>
			);
		},
	},
];
