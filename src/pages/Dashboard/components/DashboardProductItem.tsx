import { GetProjectListResponse } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import logo from '@/assets/logos/trans-logo.png';
import DashboardIcon from '@/common/icons/DashboardIcon';
import DocumentIcon from '@/common/icons/DocumentIcon';
import FavoriteIcon from '@/common/icons/FavoriteIcon';
import MyAvatar from '@/components/MyAvatar';
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from '@/components/ui/context-menu';
import { queryClient } from '@/queryClient';
import { formatDate } from '@/utils/utils';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { useMutation } from '@tanstack/react-query';
import { ArrowUpRight, Dot, Plus, Trash2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
	item: GetProjectListResponse;
};

export default function DashboardProductItem({ item }: Props) {
	const { organizationId } = useParams<{ organizationId: string }>();
	const navigate = useNavigate();

	const deleteProjectMutate = useMutation({
		mutationFn: (payload: { id: string }) => ProjectApis.prototype.deleteProject(payload),
	});

	const favoriteProjectMutate = useMutation({
		mutationFn: ProjectApis.prototype.favoriteProject,
	});

	const onDeleteProject = (id: string) => {
		deleteProjectMutate.mutate(
			{ id },
			{
				onSuccess: () => {
					queryClient.setQueryData<{
						pageCurrent: string;
						pageSize: string;
						totalPage: string;
						projects: GetProjectListResponse[];
					}>(['projects', organizationId], (oldData) => {
						if (!oldData) return oldData;

						const updatedProjects = oldData.projects.filter((project) => project.id !== id);

						return {
							...oldData,
							projects: updatedProjects,
						};
					});

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

	const onUpdateFavProject = () => {
		favoriteProjectMutate.mutate(
			{ projectId: item.id },
			{
				onSuccess: () => {
					queryClient.setQueryData<{
						pageCurrent: string;
						pageSize: string;
						totalPage: string;
						projects: GetProjectListResponse[];
					}>(['projects', organizationId], (oldData) => {
						if (!oldData) return oldData;

						const updatedProjects = oldData.projects.map((project) =>
							project.id === item.id ? { ...project, favorite: !project.favorite } : project
						);

						return {
							...oldData,
							projects: updatedProjects,
						};
					});
				},
			}
		);
	};

	return (
		<ContextMenu>
			<ContextMenuTrigger>
				<Link to={`/playground/${item.id}`} className={deleteProjectMutate.isPending ? `pointer-events-none` : ''}>
					<div className="mt-1 flex w-[290px] cursor-pointer flex-col rounded-[18px] border-[1px] border-gray-200 p-[6px] shadow duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md">
						<div className="flex h-[140px] items-center justify-center rounded-[12px] bg-[#f7f7f7]">
							<div className="rounded-[38px] border-[0.5px] border-[#edebea] p-3">
								<div className="rounded-[28px] border-[0.5px] border-[#e6e3e2] p-2.5">
									<div className="rounded-[20px] border-[0.7px] border-[#e9e6e5] p-3">
										<img src={logo} alt="Transparent Logo" className="h-11 object-contain mix-blend-multiply" />
									</div>
								</div>
							</div>
						</div>
						<div className="mt-2 flex min-h-[110px] flex-col items-start justify-between space-y-3 px-2 pb-1">
							<div className="space-y-2">
								<div className="text-[16px] font-medium">{item.name}</div>
								<div className="w-fit rounded bg-[#ececec] px-1.5 text-xs font-medium">
									{item.method.name} {item.method.version} ({item.method.perspective.abbr})
								</div>
							</div>
							<div className="flex w-full items-center justify-between">
								<div className="flex items-center space-x-1">
									<MyAvatar className="h-5 w-5" fallBackContent="CN" urlAvatar={item.owner.profilePictureUrl} />
									<div className="text-xs">{item.owner.fullName}</div>
									<Dot size={12} color="#44403c" />
									<div className="text-xs">{formatDate(item.modifiedAt)}</div>
								</div>
							</div>
						</div>
					</div>
				</Link>
			</ContextMenuTrigger>
			<ContextMenuContent className="w-[170px] rounded-xl border-[0.5px] p-0 shadow">
				<div className="px-1 pb-0.5 pt-1">
					<ContextMenuItem
						className="flex items-center justify-start space-x-3 text-sm"
						onSelect={() => navigate(`/playground/${item.id}`)}
					>
						<ArrowUpRight size={18} strokeWidth={2} />
						<span>Open</span>
					</ContextMenuItem>

					<ContextMenuItem className="flex items-center justify-start space-x-3 text-sm">
						<DashboardIcon />
						<span>Dashboard</span>
					</ContextMenuItem>

					<ContextMenuSub>
						<ContextMenuSubTrigger>
							<div className="flex items-center justify-start space-x-3 text-sm">
								<DocumentIcon />
								<span>Reports</span>
							</div>
						</ContextMenuSubTrigger>
						<ContextMenuSubContent>
							<div className="px-2 text-sm font-medium">Reports</div>
							<ContextMenuSeparator />

							<ContextMenuItem className="flex items-center space-x-3">
								<Plus size={18} />
								<span>Create</span>
							</ContextMenuItem>
						</ContextMenuSubContent>
					</ContextMenuSub>

					<ContextMenuItem onSelect={onUpdateFavProject} className="flex items-center justify-start space-x-3 text-sm">
						<FavoriteIcon fill={item.favorite ? '#ef4444' : 'none'} color={item.favorite ? '#ef4444' : 'none'} />
						<span>{item.favorite ? 'Unfavorite' : 'Favorite'}</span>
					</ContextMenuItem>
				</div>

				<ContextMenuSeparator />
				<ContextMenuItem
					disabled={deleteProjectMutate.isPending}
					className="m-1 flex items-center justify-start space-x-3 text-sm text-red-500 focus:bg-red-50 focus:text-red-500"
					onSelect={() => onDeleteProject(item.id)}
				>
					<Trash2 size={18} strokeWidth={2} />
					<span className="font-medium">Move to trash</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
