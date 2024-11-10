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
import { useReactFlow } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { useContext, useState } from 'react';
import { toast } from 'sonner';

export const columns: ColumnDef<Exchange>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		size: 50,
		cell: ({ row }) => {
			const value = row.getValue<string>('name');
			return (
				<div className="flex flex-col">
					<div>{value}</div>
					<div className="text-xs text-gray-400">{value}</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'value',
		header: 'Value',
		size: 20,
		cell: ({ row }) => {
			const data = row.getValue<string>('value');
			const [value, setValue] = useState<string>(data ?? '');

			const onChangeValue = (event: React.ChangeEvent<HTMLInputElement>) => {
				event.preventDefault();
				const inputValue = event.target.value;

				// Allow decimal numbers, including those starting with zero
				if (/^\d*\.?\d*$/.test(inputValue)) {
					setValue(inputValue);
				}
			};

			return (
				<div className="w-fit">
					<input value={value} id="" className="w-full rounded border-[1.5px] p-0.5" onChange={onChangeValue} />
				</div>
			);
		},
	},
	{
		accessorKey: 'unit',
		header: 'Unit',
		size: 20,

		cell: ({ row }) => {
			const data = row.getValue<Unit>('unit');
			const { data: unit } = useQuery({
				queryKey: ['unit-group', data.unitGroup.id],
				queryFn: ({ queryKey }) => ExchangeApis.prototype.getUnitsByUnitGroupId({ id: queryKey[1] }),
			});

			const defaultValue = unit?.data.data.find((item) => item.isDefault);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="text-xs">
							Open
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
											key={index}
											className="grid cursor-pointer grid-cols-12 items-center rounded-sm px-2 py-1 transition-all duration-150 hover:bg-gray-50"
										>
											<div className="col-span-4 text-sm font-semibold text-gray-700">{item.name}</div>
											<div className="col-span-5 text-sm text-gray-600">= {item.conversionFactor}</div>
											<div className="col-span-3 text-right text-sm text-gray-500">{defaultValue?.name}</div>
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
			const { sheetDispatch } = useContext(SheetbarContext);
			const { setNodes } = useReactFlow();
			const id = row.original.id;

			const deleteExchangeMutations = useMutation({
				mutationFn: (id: string) => ExchangeApis.prototype.deleteElementaryExchange({ id }),
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
										payload: _newProcess.data as CabonerfNodeData & { id: string },
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

			return (
				<button className="flex items-center space-x-1 rounded bg-red-50 p-1" onClick={handleDeleteExchange}>
					<Trash2 size={16} color="red" />
					{deleteExchangeMutations.isPending && <ReloadIcon className="mr-2 h-2 w-2 animate-spin" />}
				</button>
			);
		},
	},
];
