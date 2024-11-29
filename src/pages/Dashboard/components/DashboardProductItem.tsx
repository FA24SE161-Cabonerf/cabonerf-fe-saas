import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { eDispatchType } from '@/@types/dispatch.type';
import { Impact, Project } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import logo from '@/assets/logos/trans-logo.png';
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
import { useMutation } from '@tanstack/react-query';
import { Copy, Dot, GitCompare, MoreHorizontal, ScanSearch, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function DashboardProductItem() {
	const project = {} as Project<Impact[], CabonerfNodeData[], unknown>;
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
		<div className="flex w-[290px] cursor-pointer flex-col rounded-[18px] border-[1px] border-gray-200 p-[6px] shadow hover:border-gray-300 hover:shadow-md">
			<div className="flex h-[140px] items-center justify-center rounded-[12px] bg-[#f7f7f7]">
				<div className="rounded-[38px] border-[0.5px] border-[#edebea] p-3">
					<div className="rounded-[28px] border-[0.5px] border-[#e6e3e2] p-2.5">
						<div className="rounded-[20px] border-[0.7px] border-[#e9e6e5] p-3">
							<img src={logo} alt="Transparent Logo" className="h-11 object-contain mix-blend-multiply" />
						</div>
					</div>
				</div>
			</div>
			<div className="mt-2 flex h-[60px] flex-col items-start justify-center space-y-1 px-2">
				<div className="text-[16px] font-medium">Project name</div>
				<div className="flex w-full items-center justify-between">
					<div className="flex items-center space-x-1">
						<MyAvatar className="h-6 w-6" fallBackContent="CN" urlAvatar="https://github.com/shadcn.png" />
						<div className="text-sm">13gucci</div>
						<Dot size={12} color="#44403c" />
						<div className="text-xs">time</div>
					</div>
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
				</div>
			</div>
		</div>
	);
}
