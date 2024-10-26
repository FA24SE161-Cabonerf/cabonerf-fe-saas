import { eDispatchType } from '@/@types/dispatch.type';
import { tMethod, tOwnerProject, tProject } from '@/@types/project.type';
import MyAvatar from '@/components/Avatar/MyAvatar';
import TheadTable from '@/components/THeadTable';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppContext } from '@/contexts/app.context';
import { formatDate } from '@/utils/utils';
import { ColumnDef } from '@tanstack/react-table';
import {
	ChevronsUpDown,
	Copy,
	Dot,
	FlaskConicalOff,
	GitCompare,
	Menu,
	MoreHorizontal,
	ScanSearch,
	SquareArrowOutUpRight,
	Trash2,
	UserRound,
	Workflow,
} from 'lucide-react';
import { useContext } from 'react';

export const columns: ColumnDef<tProject>[] = [
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="justify-start">
				<Workflow strokeWidth={2} size={18} />
				<span>Project name</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
	},
	{
		accessorKey: 'impacts',
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="justify-start">
				<FlaskConicalOff strokeWidth={2} size={18} />
				<span>Impact</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: () => <div>123 laksjdlkj alskdj alskdj aslkdj</div>,
	},
	{
		accessorKey: 'method',
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="">
				<Menu strokeWidth={2} size={18} />
				<span>Method</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => {
			const data = row.getValue<tMethod>('method');
			return <div>{`${data.name}, ${data.version} (${data.perspective.abbr})`}</div>;
		},
	},
	{
		accessorKey: 'owner',
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="">
				<UserRound strokeWidth={2} size={18} />
				<span>Owner</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => {
			const data = row.getValue<tOwnerProject>('owner');
			return (
				<div className="flex items-center space-x-1">
					<MyAvatar fallBackContent="CN" urlAvatar="" />
					<div>{data.email}</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'modifiedAt',
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
				<Dot strokeWidth={5} color="#16a34a" className="mx-0 animate-blink" />
				<span>Last edit</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => <div>{formatDate(row.getValue<string>('modifiedAt'))}</div>,
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			const project = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { dispatch } = useContext(AppContext);

			const onPreview = () => {
				if (project.impacts.length > 0) {
					dispatch({ type: eDispatchType.ADD_PROJECT_PREVIEW, payload: project });
				} else {
					alert('No');
				}
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem className="flex cursor-pointer items-center space-x-1">
							<SquareArrowOutUpRight size={17} />
							<span>Open Project</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={onPreview} className="flex cursor-pointer items-center space-x-1">
							<ScanSearch size={17} />
							<span>Preview LCA</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(project.id.toString())}
							className="flex cursor-pointer items-center space-x-1"
						>
							<Copy size={17} />
							<span>Copy ID</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex cursor-pointer items-center space-x-1">
							<GitCompare size={17} />
							<span>Compare</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="flex cursor-pointer items-center space-x-1 text-red-600">
							<Trash2 size={17} />
							<span>Delete</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
