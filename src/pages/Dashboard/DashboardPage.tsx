import { eDispatchType } from '@/@types/dispatch.type';
import ProjectApis from '@/apis/project.apis';
import { DataTable } from '@/components/data-table';
import PreviewProject from '@/components/PreviewProject';
import { Button } from '@/components/ui/button';
import TAB_TITLES from '@/constants/tab.titles';
import { AppContext } from '@/contexts/app.context';
import DashboardHeader from '@/pages/Dashboard/components/DashboardHeader';
import DashboardProductItem from '@/pages/Dashboard/components/DashboardProductItem';
import FilterProject from '@/pages/Dashboard/components/FilterProject';
import { columns } from '@/pages/Dashboard/components/Project/columns';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';

export type LayoutView = 'layout-list' | 'layout-grid';

export default function DashboardPage() {
	const {
		app: { deleteIds },
		dispatch,
	} = useContext(AppContext);
	const [layoutView, setLayoutView] = useState<LayoutView>('layout-list');

	const { data: projects, isFetching: projectsFetching } = useQuery({
		queryKey: ['projects'],
		queryFn: ProjectApis.prototype.getAllProjects,
		staleTime: 0,
		refetchOnMount: true,
	});

	const projectsData = useMemo(() => {
		if (deleteIds.length > 0) {
			return projects?.data.data.projects.filter((item) => !deleteIds.includes(item.id));
		}
		return projects?.data.data.projects;
	}, [deleteIds, projects?.data.data.projects]);

	useEffect(() => {
		document.title = TAB_TITLES.HOME;

		return () => {
			dispatch({ type: eDispatchType.CLEAR_DELETE_IDS });
		};
	}, [dispatch]);

	const toggleLayout = (value: string) => {
		setLayoutView(value as LayoutView);
	};

	return (
		<div className="flex h-full flex-col">
			{/* Header */}
			<DashboardHeader />
			<div className="mx-6 mt-5">
				<div className="flex items-center justify-between border-b pb-1.5">
					<div>
						<Button
							variant={'outline'}
							onClick={() => toggleLayout('layout-list')}
							className={clsx(`rounded-none rounded-l-sm border border-r-[0.5px] px-2.5 py-2 shadow`, {
								'bg-gray-100': layoutView === 'layout-list',
							})}
						>
							<LayoutList size={17} />
						</Button>
						<Button
							variant={'outline'}
							onClick={() => toggleLayout('layout-grid')}
							className={clsx(`rounded-none rounded-r-sm border border-l-[0.5px] px-2.5 py-2 shadow`, {
								'bg-gray-100': layoutView === 'layout-grid',
							})}
						>
							<LayoutGrid size={17} />
						</Button>
					</div>
					<FilterProject />
				</div>
			</div>

			{/* Table */}
			<div className="mx-6 flex h-full space-x-3">
				<div className="my-2 w-full">
					{layoutView === 'layout-grid' ? (
						<div className="flex flex-wrap gap-4">
							<DashboardProductItem />
						</div>
					) : (
						<DataTable isLoading={projectsFetching} data={projectsData ?? []} columns={columns} />
					)}
				</div>

				<PreviewProject />
			</div>
			{/* End Table */}
		</div>
	);
}
