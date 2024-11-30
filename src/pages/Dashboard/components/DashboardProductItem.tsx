import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import ProjectApis from '@/apis/project.apis';
import logo from '@/assets/logos/trans-logo.png';
import MyAvatar from '@/components/MyAvatar';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { AppContext } from '@/contexts/app.context';
import { formatDate } from '@/utils/utils';
import { ContextMenuTrigger } from '@radix-ui/react-context-menu';
import { useMutation } from '@tanstack/react-query';
import { ArrowUpRight, Dot, GalleryThumbnails, GitCompare, Heart, Trash2 } from 'lucide-react';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type Props = {
	item: GetProjectListResponse;
};

export default function DashboardProductItem({ item }: Props) {
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
		<ContextMenu>
			<ContextMenuTrigger>
				<Link to={`/playground/${item.id}`}>
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
						<div className="mt-2 flex min-h-[100px] flex-col items-start justify-between space-y-3 px-2 pb-1">
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
			<ContextMenuContent className="w-[200px] rounded-xl border-[0.5px] p-0 shadow">
				<div className="px-1 pb-0.5 pt-1">
					<ContextMenuItem
						className="flex items-center justify-start space-x-2 text-sm"
						onClick={() => navigate(`/playground/${item.id}`)}
					>
						<ArrowUpRight size={18} />
						<span>Open</span>
					</ContextMenuItem>
					<ContextMenuItem className="flex items-center justify-start space-x-2 text-sm" onClick={togglePreview}>
						<GalleryThumbnails size={18} />
						<span>Preview LCA</span>
					</ContextMenuItem>
					<ContextMenuItem className="flex items-center justify-start space-x-2 text-sm">
						<Heart size={18} />

						<span>{item.favorite ? 'Unfavorite' : 'Favorite'}</span>
					</ContextMenuItem>
					<ContextMenuItem className="flex items-center justify-start space-x-2 text-sm">
						<GitCompare size={18} />
						<span>Compare</span>
					</ContextMenuItem>
				</div>
				<ContextMenuSeparator />
				<ContextMenuItem
					disabled={deleteProjectMutate.isPending}
					className="m-1 flex items-center justify-start space-x-2 text-sm text-red-500 focus:bg-red-50 focus:text-red-500"
					onClick={() => onDeleteProject(item.id)}
				>
					<Trash2 size={18} strokeWidth={2} />
					<span className="font-medium">Move to trash</span>
				</ContextMenuItem>
			</ContextMenuContent>
		</ContextMenu>
	);
}
