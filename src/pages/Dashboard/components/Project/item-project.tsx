import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import MyAvatar from '@/components/MyAvatar';
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
import { useMutation } from '@tanstack/react-query';
import { Copy, GitCompare, MoreHorizontal, ScanSearch, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
	item: GetProjectListResponse;
};

export default function ItemProject({ item }: Props) {
	const navigate = useNavigate();
	const { app, dispatch } = useContext(AppContext);

	const onPreview = () => {
		dispatch({ type: eDispatchType.ADD_PROJECT_PREVIEW, payload: item });
	};

	const clearPreview = () => {
		dispatch({ type: eDispatchType.CLEAR_PROJECT_PREVIEW });
	};

	const togglePreview = () => {
		if (app.previewProject?.id === item.id) {
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
					dispatch({ type: eDispatchType.ADD_DELETE_IDS, payload: id });
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
		<div key={item.id} className="grid grid-cols-12 border-b py-2.5 hover:bg-gray-50">
			<div className="col-span-4 ml-2 text-[13px] font-medium">
				<div>{item.name}</div>
				<div>impact</div>
			</div>
			<div className="col-span-2 flex items-center space-x-2 text-[13px] font-medium">
				<MyAvatar fallBackContent="CN" className="h-5 w-5" urlAvatar={item.owner.profilePictureUrl} />
				<span>{item.owner.fullName}</span>
			</div>
			<div className="col-span-3 flex items-center text-[13px] font-medium">
				<div className="rounded-sm bg-[#ececec] px-2 py-0.5 text-xs">
					{item.method.name} {item.method.version} ({item.method.perspective.abbr})
				</div>
			</div>
			<div className="col-span-2 flex items-center text-[13px] font-medium">{formatDate(item.modifiedAt)}</div>
			<div className="col-span-1">
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
							onClick={() => navigate(`/playground/${item.id}`)}
						>
							<SquareArrowOutUpRight size={17} />
							<span>Open Project</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={togglePreview} className="flex cursor-pointer items-center space-x-1">
							<ScanSearch size={17} />
							<span>{app.previewProject?.id === item.id ? 'Close preview' : 'Preview LCA'}</span>
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(item.id.toString())}
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
							onClick={() => onDeleteProject(item.id)}
							className="flex cursor-pointer items-center space-x-1 text-red-600"
						>
							<Trash2 size={17} />
							<span>{deleteProjectMutate.isPending ? 'Deleting...' : 'Delete'}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
