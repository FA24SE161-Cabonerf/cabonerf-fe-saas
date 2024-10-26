import { tProject } from '@/@types/project.type';
import ImpactAssessmentMethodApi from '@/apis/impactMethod.api';
import { CustomComboBox } from '@/components/CustomComboBox/CustomComboBox';
import { DataTable } from '@/components/DataTable/data-table';
import PreviewProject from '@/components/PreviewProject';
import { Button } from '@/components/ui/button';
import TAB_TITLES from '@/constants/tab.titles';
import DashboardHeader from '@/pages/Dashboard/components/DashboardHeader';
import { columns } from '@/pages/Dashboard/components/Project/columns';
import { mockData } from '@/utils/data';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { Download, Filter, LayoutGrid, LayoutList } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export type LayoutView = 'layout-list' | 'layout-grid';

const getData = async (): Promise<tProject[]> => {
	return mockData;
};

export default function DashboardPage() {
	const [layoutView, setLayoutView] = useState<LayoutView>('layout-list');
	const [data, setData] = useState<tProject[]>([]);
	const [selectedMethod, setSelectedMethod] = useState<number>();

	const { data: impactAssessmentMethods, isSuccess } = useQuery({
		queryKey: ['impact_assessment_method'],
		queryFn: ImpactAssessmentMethodApi.prototype.getListImpactMethod,
		staleTime: 60_000,
	});

	const _impactAssessmentMethodQuery = useMemo(() => {
		if (isSuccess) {
			return impactAssessmentMethods.data.data.map((item) => ({
				id: item.id,
				value: `${item.name}, ${item.version} (${item.perspective.abbr})`,
				label: `${item.name}, ${item.version} (${item.perspective.abbr})`,
			}));
		}
	}, [impactAssessmentMethods, isSuccess]);

	useEffect(() => {
		document.title = TAB_TITLES.HOME;
	}, []);

	useEffect(() => {
		const fetch = async () => {
			const data = await getData();
			setData(data);
		};

		fetch();
	}, []);

	const toggleLayout = (value: string) => {
		setLayoutView(value as LayoutView);
	};

	const updateSelectedMethod = (id: number) => {
		setSelectedMethod(id);
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

					<div className="flex space-x-2">
						<CustomComboBox
							title="Select impact method"
							onSelected={updateSelectedMethod}
							data={_impactAssessmentMethodQuery ?? []}
							className="w-auto px-2 font-normal"
							placeHolder="Search method ..."
						/>
						<Button className="flex items-center space-x-2 px-3 font-normal" variant={'outline'}>
							<Filter size={16} />
							<span>Filter</span>
						</Button>
						<Button className="flex items-center space-x-1 px-3 font-normal" variant={'outline'}>
							<Download size={16} />
							<span>Export</span>
						</Button>
					</div>
				</div>
			</div>

			{/* Table */}
			<div className="mx-6 flex h-full space-x-3">
				<div className="my-2 w-full">
					<DataTable data={data} columns={columns} />
				</div>
				<PreviewProject />
			</div>
			{/* End Table */}
		</div>
	);
}
