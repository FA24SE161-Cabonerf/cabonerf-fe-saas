import { eDispatchType } from '@/@types/dispatch.type';
import { OrganizeApis } from '@/apis/organiza.apis';
import ProjectApis from '@/apis/project.apis';
import PreviewProject from '@/components/PreviewProject';
import { Button } from '@/components/ui/button';
import TAB_TITLES from '@/constants/tab.titles';
import { AppContext } from '@/contexts/app.context';
import DashboardHeader from '@/pages/Dashboard/components/DashboardHeader';
import DashboardProductItem from '@/pages/Dashboard/components/DashboardProductItem';
import TableProject from '@/pages/Dashboard/components/Project/table-project';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { LayoutGrid, LayoutList } from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export type LayoutView = 'layout-list' | 'layout-grid';

export default function DashboardPage() {
	const navigate = useNavigate();
	const { organizationId } = useParams<{ organizationId: string }>();

	const {
		app: { deleteIds },
		dispatch,
	} = useContext(AppContext);
	const [layoutView, setLayoutView] = useState<LayoutView>('layout-list');

	const organizations = useQuery({
		queryKey: ['organizations'],
		queryFn: OrganizeApis.prototype.getOrganizationsByUser,
		enabled: false,
		staleTime: 60 * 1000 * 60,
	});

	const { data: projects, error } = useQuery({
		queryKey: ['projects', organizationId],
		queryFn: ({ queryKey }) => ProjectApis.prototype.getAllProjects({ organizationId: queryKey[1] as string }),
		staleTime: 0,
		refetchOnMount: true,
		enabled: organizationId !== undefined,
	});

	const projectsData = useMemo(() => {
		if (deleteIds.length > 0) {
			return projects?.data.data.projects.filter((item) => !deleteIds.includes(item.id));
		}
		return projects?.data.data.projects;
	}, [deleteIds, projects?.data.data.projects]);

	useEffect(() => {
		if (!organizationId && organizations.data) {
			const defaultOrg = organizations.data.data.data.find((org) => org.default === true);
			if (defaultOrg) {
				navigate(`/dashboard/${defaultOrg.id}`);
			} else {
				console.error('No default organization found.');
			}
		}
	}, [organizationId, organizations.data, navigate]);

	useEffect(() => {
		document.title = `Projects - ${TAB_TITLES.HOME}`;

		return () => {
			dispatch({ type: eDispatchType.CLEAR_DELETE_IDS });
		};
	}, [dispatch]);

	const toggleLayout = (value: string) => {
		setLayoutView(value as LayoutView);
	};

	if (error) {
		console.error('Error fetching projects:', error);
		return <div>Error loading projects. Please try again later.</div>;
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex flex-col ease-in"
		>
			{/* Header */}
			<DashboardHeader />
			<div className="mx-6 mt-5">
				<div className="flex items-center justify-between space-x-1 border-b pb-1.5">
					<div className="relative text-sm font-semibold after:absolute after:-bottom-3.5 after:left-0 after:h-[3px] after:w-full after:bg-black">
						Recents
					</div>
					<div className="flex items-center">
						<Button
							variant={'outline'}
							onClick={() => toggleLayout('layout-list')}
							className={clsx(`mr-1 h-fit border-none px-2 shadow-none`, {
								'bg-gray-100': layoutView === 'layout-list',
							})}
						>
							<LayoutList size={15} />
						</Button>
						<Button
							variant={'outline'}
							onClick={() => toggleLayout('layout-grid')}
							className={clsx(`mr-1 h-fit border-none px-2 shadow-none`, {
								'bg-gray-100': layoutView === 'layout-grid',
							})}
						>
							<LayoutGrid size={15} />
						</Button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="mx-6 flex h-full">
				<div className="my-2 w-full">
					{layoutView === 'layout-grid' ? (
						<div className="flex flex-wrap gap-4">
							<DashboardProductItem />
							<DashboardProductItem />
							<DashboardProductItem />
							<DashboardProductItem />
						</div>
					) : (
						// <DataTable isLoading={projectsFetching} data={projectsData ?? []} columns={columns} />
						<TableProject data={projectsData ?? []} />
					)}
				</div>

				<PreviewProject />
			</div>
			{/* End Table */}
		</motion.div>
	);
}
