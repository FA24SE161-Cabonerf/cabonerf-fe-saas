import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import MyAvatar from '@/components/MyAvatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AppContext } from '@/contexts/app.context';
import { queryClient } from '@/queryClient';
import { formatDate } from '@/utils/utils';
import { useMutation } from '@tanstack/react-query';
import { ArrowUpRight, GalleryThumbnails, Heart, MoreHorizontal, Trash2 } from 'lucide-react';
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
	item: GetProjectListResponse;
};

function ItemProject({ item }: Props) {
	const { organizationId } = useParams<{ organizationId: string }>();

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

	const triggerProjectId = () => {
		dispatch({ type: eDispatchType.SELECT_CHECKBOX, payload: item.id });
	};

	return (
		<div key={item.id} className="grid grid-cols-12 items-center border-b px-[18px] py-2.5 hover:bg-gray-50">
			<div className="col-span-4 flex items-center space-x-4 text-left text-[13px] font-medium">
				<Checkbox
					checked={app.selectCheckbox.includes(item.id)}
					onClick={triggerProjectId}
					className="h-5 w-5 rounded-sm border-[1px] border-gray-200 bg-white shadow focus:border-[0.5px] data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
				/>
				<div>{item.name}</div>
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
					<DropdownMenuContent className="w-[170px] rounded-xl border-[0.5px] p-0 shadow">
						<div className="px-1 pb-0.5 pt-1">
							<DropdownMenuItem
								className="flex items-center justify-start space-x-2 text-sm"
								onClick={() => navigate(`/playground/${item.id}`)}
							>
								<ArrowUpRight size={18} strokeWidth={2} />
								<span>Open</span>
							</DropdownMenuItem>
							<DropdownMenuItem className="flex items-center justify-start space-x-2 text-sm" onClick={togglePreview}>
								<GalleryThumbnails size={18} strokeWidth={2} />
								<span>Preview LCA</span>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onUpdateFavProject} className="flex items-center justify-start space-x-2 text-sm">
								<Heart
									size={18}
									strokeWidth={2}
									fill={item.favorite ? '#ef4444' : 'none'}
									stroke={item.favorite ? '#ef4444' : 'black'}
								/>

								<span>{item.favorite ? 'Unfavorite' : 'Favorite'}</span>
							</DropdownMenuItem>
						</div>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							disabled={deleteProjectMutate.isPending}
							className="m-1 flex items-center justify-start space-x-2 text-sm text-red-500 focus:bg-red-50 focus:text-red-500"
							onClick={() => onDeleteProject(item.id)}
						>
							<Trash2 size={18} strokeWidth={2} />
							<span className="font-medium">Move to trash</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}

export default React.memo(ItemProject);
