import { ExchangeApis } from '@/apis/exchange.apis';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export type Exchange = {
	id: string;
	value: number;
	name: string;
	exchangesType: {
		id: string;
		name: string;
	};
	substancesCompartments: string;
	unit: {
		id: string;
		name: string;
		conversionFactor: number;
		unitGroup: {
			id: string;
			name: string;
			unitGroupType: string;
		};
		isDefault: boolean;
	};
	input: boolean;
};

export const columns: ColumnDef<Exchange>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		size: 50,
		cell: ({ row }) => {
			const value = row.getValue<string>('name');
			const data = row.original.substancesCompartments;
			return (
				<div className="flex flex-col">
					<div>{value}</div>
					<div className="text-xs text-gray-400">{data}</div>
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
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
			return <div>123</div>;
		},
	},
	{
		id: 'actions',
		size: 10,
		cell: ({ row }) => {
			return (
				<button className="rounded bg-red-50 p-1">
					<Trash2 size={16} color="red" />
				</button>
			);
		},
	},
];
