import { ColumnDef, flexRender, getCoreRowModel, useReactTable, getPaginationRowModel } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function ExchangeTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
	const [pagination, setPagination] = useState({
		pageIndex: 0, //initial page index
		pageSize: 5, //default page size
	});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		state: {
			pagination,
		},
	});

	return (
		<React.Fragment>
			<div className="border-gray-200">
				<Table className="rounded-lg bg-[#f5f5f5]">
					<TableHeader className="rounded-t-lg">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="border-none" key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} style={{ width: header.getSize() }} className="p-2">
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>

					<tbody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row, index) => (
								<tr key={row.id} className={`border bg-white ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
									{row.getVisibleCells().map((cell) => (
										<td className="mt-2 p-2" key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td colSpan={columns.length} className="h-24 text-center">
									No elementary.
								</td>
							</tr>
						)}
					</tbody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{pagination.pageIndex + 1} of {table.getPageCount()} page(s).
				</div>
				<div className="space-x-2">
					<Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
						Previous
					</Button>
					<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
						Next
					</Button>
				</div>
			</div>
		</React.Fragment>
	);
}
