import { eDispatchType } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import ImpactMethodApis from '@/apis/impactMethod.apis';
import ImpactCategoriesComboBox from '@/components/ImpactCategoriesComboBox/ImpactCategoriesComboBox';
import ImpactMethodComboBox from '@/components/ImpactMethodComboBox/ImpactMethodComboBox';
import { Button } from '@/components/ui/button';
import { AppContext } from '@/contexts/app.context';
import { useQuery } from '@tanstack/react-query';
import { Download, Filter } from 'lucide-react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

export default function FilterProject() {
	const {
		app: { impactCategory },
		dispatch,
	} = useContext(AppContext);
	const [selectedImpactMethodId, setSelectedImpactMethodId] = useState<string>('');

	const { data: impactMethods, isLoading: impact_methods_loading } = useQuery({
		queryKey: ['impact_methods'],
		queryFn: ImpactMethodApis.prototype.getImpactMethods,
		staleTime: 60_000,
	});

	const { data: impactCategories, isSuccess: impact_categories_success } = useQuery({
		queryKey: ['impact_categories', selectedImpactMethodId],
		queryFn: () => ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: selectedImpactMethodId as string }),
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
			impactCategories?.data.data.map((data) => ({
				...data,
				value: data.name,
				label: data.name,
				midPointName: data.midpointImpactCategory.name,
				abbr: data.midpointImpactCategory.abbr,
				iconUrl: data.iconUrl,
			})) || []
		);
	}, [impactCategories?.data.data]);

	useEffect(() => {
		if (impactMethods?.data.data) {
			setSelectedImpactMethodId(impactMethods?.data.data[0].id);
		}
	}, [impactMethods?.data.data]);

	useEffect(() => {
		if (impactCategories?.data.data) {
			dispatch({ type: eDispatchType.SET_IMPACT_CATEGORY, payload: impactCategories?.data.data[0] });
		}
	}, [impactCategories?.data.data, dispatch]);

	const updateSelectedImpactMethod = useCallback((id: string) => {
		setSelectedImpactMethodId(id);
	}, []);

	const updateSelectedImpactCategories = useCallback(
		(payload: ImpactCategory) => {
			dispatch({ type: eDispatchType.SET_IMPACT_CATEGORY, payload });
		},
		[dispatch]
	);

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
				selectedId={impactCategory as ImpactCategory}
				isLoading={!impact_categories_success}
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
