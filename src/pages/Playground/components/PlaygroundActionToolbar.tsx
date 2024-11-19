import { PlaygroundDispatch } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import ImpactMethodApis from '@/apis/impactMethod.apis';
import ProjectApis from '@/apis/project.apis';
import ImpactCategoriesComboBox from '@/components/ImpactCategoriesComboBox';
import ImpactMethodComboBox from '@/components/ImpactMethodComboBox';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

function PlaygroundActionToolbar() {
	const { playgroundState, playgroundDispatch } = useContext(PlaygroundContext);
	const params = useParams<{ pid: string; wid: string }>();

	const { data: impactMethods, isLoading: impact_methods_loading } = useQuery({
		queryKey: ['impact_methods'],
		queryFn: ImpactMethodApis.prototype.getImpactMethods,
		staleTime: 60_000,
	});

	const { data: impactCategories, isSuccess: impact_categories_success } = useQuery({
		queryKey: ['impact_categories', playgroundState.impactMethod],
		queryFn: ({ queryKey }) => ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: queryKey[1] as string }),
		staleTime: 60_000,
		enabled: playgroundState.impactMethod !== undefined,
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
		if (impactCategories?.data.data) {
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_CATEGORY, payload: impactCategories?.data.data[0] });
		}
	}, [impactCategories?.data.data, playgroundDispatch]);

	const updateProjectMethod = useMutation({
		mutationFn: ProjectApis.prototype.updateImpactMethodProject,
	});

	const updateSelectedImpactMethod = useCallback(
		(id: string) => {
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_METHOD, payload: id });
			updateProjectMethod.mutate({ pid: params.pid as string, mid: id });
		},
		[playgroundDispatch, params.pid, updateProjectMethod]
	);

	const updateSelectedImpactCategories = useCallback(
		(payload: ImpactCategory) => {
			playgroundDispatch({ type: PlaygroundDispatch.SET_IMPACT_CATEGORY, payload });
		},
		[playgroundDispatch]
	);

	return (
		<div className="rounded-[15px] border-[0.5px] border-gray-100 bg-white p-1.5 shadow">
			<div className="flex items-center space-x-2">
				{/* Method  */}
				<ImpactMethodComboBox
					selectedId={playgroundState.impactMethod as string}
					isLoading={impact_methods_loading}
					title="Select impact method"
					onSelected={updateSelectedImpactMethod}
					data={_impactMethods}
					isRounded
				/>

				<ImpactCategoriesComboBox
					selectedId={playgroundState.impactCategory as ImpactCategory}
					isLoading={!impact_categories_success}
					onSelected={updateSelectedImpactCategories}
					data={_impactCategories}
					isRounded
				/>
				{/* Category of method */}
			</div>
		</div>
	);
}

export default React.memo(PlaygroundActionToolbar);
