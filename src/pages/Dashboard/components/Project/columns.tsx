/* eslint-disable react-hooks/rules-of-hooks */
import { eDispatchType } from '@/@types/dispatch.type';
import { ImpactMethod } from '@/@types/impactMethod.type';
import { GetProjectListResponse, Impact, Owner } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import MyAvatar from '@/components/MyAvatar';
import TheadTable from '@/components/TheadTable';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { AppContext } from '@/contexts/app.context';
import { formatDate } from '@/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
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
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const columns: ColumnDef<GetProjectListResponse>[] = [
	{
		accessorKey: 'name',
		size: 400,
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
		size: 300,
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="justify-start">
				<FlaskConicalOff strokeWidth={2} size={18} />
				<span>Impact</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => {
			const {
				app: { impactCategory },
			} = useContext(AppContext);

			const impactData = row.getValue<Impact[]>('impacts');

			if (!impactCategory) return <Skeleton className="h-[24px] w-[160px] rounded" />;

			// Find the matching impact category ID and return the value or default to 0 if not found
			const matchingImpact = impactData.find((data) => data.impactCategory.id === impactCategory.id);
			const value = matchingImpact ? matchingImpact.value : 0;

			return (
				<div className="flex items-center space-x-1">
					{impactCategory.iconUrl && <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(impactCategory.iconUrl) }} />}
					<span className="font-medium">{value}</span>
					<span>{impactCategory.midpointImpactCategory?.unit?.name || ''}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'method',
		size: 400,
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="">
				<Menu strokeWidth={2} size={18} />
				<span>Method</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => {
			const data = row.getValue<Omit<ImpactMethod, 'reference'>>('method');
			return <div>{`${data.name}, ${data.version} (${data.perspective.abbr})`}</div>;
		},
	},
	{
		accessorKey: 'owner',
		size: 400,
		header: ({ column }) => (
			<TheadTable onAction={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="">
				<UserRound strokeWidth={2} size={18} />
				<span>Owner</span>
				<ChevronsUpDown strokeWidth={2} size={15} />
			</TheadTable>
		),
		cell: ({ row }) => {
			const data = row.getValue<Owner>('owner');
			return (
				<div className="flex items-center space-x-1">
					<MyAvatar fallBackContent="CN" urlAvatar="https://github.com/shadcn.png" />
					<div>{data.email}</div>
				</div>
			);
		},
	},
	{
		accessorKey: 'modifiedAt',
		size: 200,
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
		size: 100,
		cell: ({ row }) => {
			const project = row.original;
			const navigate = useNavigate();
			const { app, dispatch } = useContext(AppContext);

			const onPreview = () => {
				dispatch({ type: eDispatchType.ADD_PROJECT_PREVIEW, payload: project });
			};

			const clearPreview = () => {
				dispatch({ type: eDispatchType.CLEAR_PROJECT_PREVIEW });
			};

			const togglePreview = () => {
				if (app.previewProject?.id === project.id) {
					return clearPreview();
				}
				return onPreview();
			};

			const deleteProjectMutate = useMutation({
				mutationFn: (payload: { id: string }) => ProjectApis.prototype.deleteProject(payload),
			});

			const onDeleteProject = (id: string) => {
				deleteProjectMutate.mutate(
					{ id },
					{
						onSuccess: () => {
							// dispatch({ type: eDispatchType.ADD_DELETE_IDS, payload: id });
							toast(`Project has been deleted: ${id}`, {
								description: 'Sunday, December 03, 2023 at 9:00 AM',
								action: {
									label: 'Undo',
									onClick: () => alert('Processing'),
								},
							});
						},
					}
				);
			};

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-[150px]">
						<DropdownMenuItem
							className="flex cursor-pointer items-center space-x-1"
							onClick={() => navigate(`/playground/${project.id}/6ccbff7f-9653-44c0-8ddb-e7728f12e5a0`)}
						>
							<SquareArrowOutUpRight size={17} />
							<span>Open Project</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={togglePreview} className="flex cursor-pointer items-center space-x-1">
							<ScanSearch size={17} />
							<span>{app.previewProject?.id === project.id ? 'Close preview' : 'Preview LCA'}</span>
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
						<DropdownMenuItem
							disabled={deleteProjectMutate.isPending}
							onClick={() => onDeleteProject(project.id)}
							className="flex cursor-pointer items-center space-x-1 text-red-600"
						>
							<Trash2 size={17} />
							<span>{deleteProjectMutate.isPending ? 'Deleting...' : 'Delete'}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
