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
import { toast as hotToast } from 'react-hot-toast';
import { queryClient } from '@/queryClient';
import { Edge, Node, useReactFlow } from '@xyflow/react';
import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { Impact, Project } from '@/@types/project.type';
import { CabonerfEdgeData } from '@/@types/cabonerfEdge.type';

function PlaygroundActionToolbar() {
	const { getNodes, getEdges } = useReactFlow<Node<CabonerfNodeData>, Edge<CabonerfEdgeData>>();
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
			hotToast.promise(
				new Promise((resolve, reject) => {
					updateProjectMethod.mutate(
						{ pid: params.pid as string, mid: id },
						{
							onSuccess: (data) => {
								const new_project = data.data.data;
								const current_nodes = getNodes();
								const current_edges = getEdges();

								const nodes_new_project = new Map(new_project.processes.map((item) => [item.id, item]));

								const project_converted: Project<Impact, Node<CabonerfNodeData>[], Edge<CabonerfEdgeData>[]> = {
									...new_project,
									processes: current_nodes.map((item) => {
										const p = nodes_new_project.get(item.id);

										return {
											...item,
											data: {
												...item.data,
												impacts: p?.impacts || [],
												exchanges: p?.exchanges || [],
											},
										};
									}),
									connectors: current_edges,
								};

								queryClient.setQueryData(['projects', params.pid], project_converted);
								resolve(true);
							},
							onError: () => {
								reject(false);
							},
						}
					);
				}),
				{
					loading: <p className="text-sm">Changing your project impact method...</p>,
					success: null,
					error: null,
				},
				{
					position: 'top-center',
					error: {
						style: {
							visibility: 'hidden',
						},
					},
					success: {
						style: {
							visibility: 'hidden',
						},
					},
				}
			);
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
