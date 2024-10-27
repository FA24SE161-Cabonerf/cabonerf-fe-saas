import ImpactCategoryApis from '@/apis/impactCategories.apis';
import ImpactMethodApis from '@/apis/impactMethod.apis';
import { ImpactCategoriesComboBox } from '@/components/ImpactCategoriesComboBox/ImpactCategoriesComboBox';
import { ImpactMethodComboBox } from '@/components/ImpactMethodComboBox/ImpactMethodComboBox';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Download, Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

export default function FilterProject() {
	const [selectedImpactMethodId, setSelectedImpactMethodId] = useState<string>('');
	const [selectedImpactCategoriesId, setSelectedImpactCategoriesId] = useState<string>('');

	const { data: impactMethods, isLoading: impact_methods_loading } = useQuery({
		queryKey: ['impact_methods'],
		queryFn: ImpactMethodApis.prototype.getImpactMethods,
		staleTime: 60_000,
	});

	const { data: impactCategories, isSuccess: impact_categories_success } = useQuery({
		queryKey: ['impact_categories', selectedImpactMethodId],
		queryFn: () =>
			ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: selectedImpactMethodId as string }),
		staleTime: 60_000,
		enabled: !!selectedImpactMethodId,
	});

	const _impactMethods = useMemo(() => {
		return (
			impactMethods?.data.data.map(({ id, name, version, perspective }) => ({
				id,
				value: `${name}, ${version} (${perspective.abbr})`,
				label: `${name}, ${version} (${perspective.abbr})`,
			})) || []
		);
	}, [impactMethods?.data.data]);

	const _impactCategories = useMemo(() => {
		return (
			impactCategories?.data.data.map(
				({ id, iconUrl, name: impactName, midpointImpactCategory: { name: midPointName, abbr } }) => ({
					id,
					value: impactName,
					label: impactName,
					iconUrl: iconUrl,
					midPointName: midPointName,
					abbr: abbr,
				})
			) || []
		);
	}, [impactCategories?.data.data]);

	useEffect(() => {
		if (impactMethods?.data.data) {
			setSelectedImpactMethodId(impactMethods?.data.data[0].id);
		}
	}, [impactMethods?.data.data]);

	useEffect(() => {
		if (impactCategories?.data.data) {
			setSelectedImpactCategoriesId(impactCategories?.data.data[0].id);
		}
	}, [impactCategories?.data.data]);

	const updateSelectedImpactMethod = (id: string) => {
		setSelectedImpactMethodId(id);
	};

	const updateSelectedImpactCategories = (id: string) => {
		setSelectedImpactCategoriesId(id);
	};

	return (
		<div className="flex space-x-2">
			<ImpactMethodComboBox
				selectedId={selectedImpactMethodId}
				isLoading={impact_methods_loading}
				title="Select impact method"
				onSelected={updateSelectedImpactMethod}
				data={_impactMethods}
			/>

			<ImpactCategoriesComboBox
				selectedId={selectedImpactCategoriesId}
				isLoading={!impact_categories_success}
				title="Select impact method"
				onSelected={updateSelectedImpactCategories}
				data={_impactCategories}
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
	);
}
