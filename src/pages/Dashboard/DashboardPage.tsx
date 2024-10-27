import ProjectApis from '@/apis/project.apis';
import { DataTable } from '@/components/DataTable/data-table';
import PreviewProject from '@/components/PreviewProject';
import { Button } from '@/components/ui/button';
import TAB_TITLES from '@/constants/tab.titles';
import DashboardHeader from '@/pages/Dashboard/components/DashboardHeader';
import FilterProject from '@/pages/Dashboard/components/FilterProject';
import { columns } from '@/pages/Dashboard/components/Project/columns';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useEffect, useState } from 'react';

export type LayoutView = 'layout-list' | 'layout-grid';

export default function DashboardPage() {
	const [layoutView, setLayoutView] = useState<LayoutView>('layout-list');

	const projectsQuery = useQuery({
		queryKey: ['projects'],
		queryFn: ProjectApis.prototype.getAllProjects,
		staleTime: 60_000,
	});

	useEffect(() => {
		document.title = TAB_TITLES.HOME;
	}, []);

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
					<DataTable
						isLoading={projectsQuery.isLoading}
						data={projectsQuery.data?.data.data.projects ?? []}
						columns={columns}
					/>
				</div>

				<PreviewProject />
			</div>
			{/* End Table */}
		</div>
	);
}
