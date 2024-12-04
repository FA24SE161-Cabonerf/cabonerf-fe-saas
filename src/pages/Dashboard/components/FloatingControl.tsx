import { eDispatchType } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { GetProjectListResponse } from '@/@types/project.type';
import ImpactCategoryApis from '@/apis/impactCategories.apis';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import WarningSooner from '@/components/WarningSooner';
import { AppContext } from '@/contexts/app.context';
import { queryClient } from '@/queryClient';
import { calculatePercentageDifference, formatNumberExponential, updateSVGAttributes } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, ChartSpline, Check, ChevronDown, GitCompare, X } from 'lucide-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis, YAxis } from 'recharts';
import { toast } from 'sonner';

const chartConfig = {
	first: {
		label: 'first',
		color: '#16a34a',
	},
	second: {
		label: 'second',
		color: '#3b82f6',
	},
} satisfies ChartConfig;

const color = ['#4f9b90', '#d87558', '#2f4653', '#e3c576', '#e8a76d', '#ecaeb7'];

const chartConfigs = {
	desktop: {
		label: 'Desktop',
		color: 'hsl(var(--chart-1))',
	},
	mobile: {
		label: 'Mobile',
		color: 'hsl(var(--chart-2))',
	},
	phone: {
		label: 'Phone',
		color: '#cecece',
	},
} satisfies ChartConfig;

function FloatingControl() {
	const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
	const [compareProjects, setCompareProjects] = useState<GetProjectListResponse[]>([]);
	const [methodId, setMethodId] = useState<string | null>(null);
	const [baseIndex, setBasedIndex] = useState<number>(0);
	const [selectImpactCategory, setSelectImpactCategory] =
		useState<Omit<ImpactCategory, 'indicator' | 'indicatorDescription' | 'unit' | 'emissionCompartment'>>();
	const { organizationId } = useParams<{ organizationId: string }>();
	const { app, dispatch } = useContext(AppContext);

	const length = app.selectCheckbox.length;

	const project = queryClient.getQueryData<{
		pageCurrent: string;
		pageSize: string;
		totalPage: string;
		projects: GetProjectListResponse[];
	}>(['projects', organizationId]);

	const projectCompareOnChart = useMemo(() => {
		return compareProjects.map((item) => ({
			projectId: item.id,
			methodId: item.method.id,
			chartData: item.impacts.map((item) => ({
				abbr: item.impactCategory.midpointImpactCategory.abbr,
				name: item.impactCategory.midpointImpactCategory.name,
				impactCategory: item.impactCategory.name,
				unit: item.impactCategory.midpointImpactCategory.unit.name,
				value: item.value,
			})),
		}));
	}, [compareProjects]);

	const projectCompareByImpactCategory = useMemo(() => {
		return compareProjects.map((project, index) => {
			return {
				data: project.impacts.find((item) => item.impactCategory.id === selectImpactCategory?.id),
				baseIndex: index,
			};
		});
	}, [compareProjects, selectImpactCategory?.id]);

	const calculateDiffValue = useMemo(() => {
		const [value1, value2] = [
			projectCompareByImpactCategory[0]?.data?.value as number,
			projectCompareByImpactCategory[1]?.data?.value as number,
		];

		const isBaseIndexZero = baseIndex === 0;

		if (value1 === 0 && value2 === 0) {
			return {
				value: null,
				isReduce: null,
			};
		}

		// Calculate the ratio and comparison based on baseIndex
		const value = calculatePercentageDifference(value1, value2, isBaseIndexZero ? 'value1' : 'value2');
		const isReduce = isBaseIndexZero ? value2 < value1 : value1 < value2;

		return { value, isReduce };
	}, [baseIndex, projectCompareByImpactCategory]);

	const lifeCycleStageContributeByImpactCategory = useMemo(() => {
		return compareProjects.map((project) => {
			const object: { [key: string]: number | string } = {
				projectName: project.name,
			};
			const lifeStage = project.lifeCycleStageBreakdown?.find((item) => item.id === selectImpactCategory?.id)?.lifeCycleStage;

			if (lifeStage) {
				lifeStage.forEach((item) => {
					object[item.name] = item.percent * 100;
				});
			}

			return object;
		});
	}, [compareProjects, selectImpactCategory]);

	console.log(lifeCycleStageContributeByImpactCategory);

	const impactCategoryByProjectMethodQuery = useQuery({
		queryKey: ['impact_categories', methodId],
		queryFn: ({ queryKey }) => ImpactCategoryApis.prototype.getImpactCategoriesByImpactMethodID({ id: queryKey[1] as string }),
		enabled: Boolean(methodId),
	});

	useEffect(() => {
		if (impactCategoryByProjectMethodQuery.data?.data.data) {
			setSelectImpactCategory(impactCategoryByProjectMethodQuery.data.data.data[0]);
		}
	}, [impactCategoryByProjectMethodQuery.data?.data.data]);

	const onCompare = () => {
		const selectedProjects = project?.projects.filter((item) => app.selectCheckbox.includes(item.id));

		if (!selectedProjects) {
			return;
		}

		if (selectedProjects.length > 2) {
			toast(<WarningSooner message={`Only up to 2 projects using the same method can be compared at once.`} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
			return;
		} else if (selectedProjects.length === 1) {
			toast(<WarningSooner message={`At least 2 projects are required for comparison.`} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
			return;
		}

		let isValid = false;

		if (selectedProjects.length > 1) {
			const referenceMethodId = selectedProjects[0].method.id;
			isValid = selectedProjects.every((item) => item.method.id === referenceMethodId);
		}

		if (!isValid) {
			toast(<WarningSooner message={`Comparison is only possible for projects using the same method.`} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
			return;
		}

		const isValidImpacts = selectedProjects?.every((item) => item.impacts.length > 0);

		if (!isValidImpacts) {
			toast(<WarningSooner message={`Please ensure the selected projects are calculated before comparing.`} />, {
				className: 'rounded-2xl p-2 w-[350px]',
				style: {
					border: `1px solid #dedede`,
					backgroundColor: `#fff`,
				},
			});
			return;
		}
		setMethodId(selectedProjects[0].method.id);
		setCompareProjects(selectedProjects);
		setIsOpenDialog(true);
	};

	const handleSetImpactCategory = (item: Omit<ImpactCategory, 'indicator' | 'indicatorDescription' | 'unit' | 'emissionCompartment'>) => {
		setSelectImpactCategory(item);
	};

	return (
		<Dialog modal={true} open={isOpenDialog} onOpenChange={setIsOpenDialog}>
			<div
				className={clsx(`absolute bottom-3 left-1/2 -translate-x-1/2 transition-all duration-300`, {
					'translate-y-14 opacity-0': length === 0,
					'translate-y-0 opacity-100': length > 0,
				})}
			>
				<div className="flex w-[550px] rounded-[14px] border bg-white px-3 py-1.5 text-xs shadow-lg">
					<div className="flex w-1/2 items-center">
						<Check className="mr-3 rounded-md border bg-black p-1" stroke="white" size={26} />
						<span className="font-medium">
							{length} {length > 1 ? 'Projects' : 'Project'} selected
						</span>
					</div>
					<div className="flex w-1/2 items-center justify-end space-x-5">
						<div className="flex items-center">
							<button onClick={onCompare} className="flex items-center space-x-1 rounded-sm px-3 py-2 hover:bg-gray-100">
								<GitCompare size={17} color="#15803d" />
								<span className="font-medium text-green-700">Compare</span>
							</button>
							<Separator orientation="vertical" className="mx-2 h-5" />
							<button className="rounded-sm px-3 py-2 hover:bg-gray-100">Delete</button>
						</div>
						<button className="rounded-sm p-1 hover:bg-gray-100" onClick={() => dispatch({ type: eDispatchType.CLOSE_CHECKBOX })}>
							<X size={17} strokeWidth={1.5} />
						</button>
					</div>
				</div>
			</div>
			<Tabs defaultValue="bar-chart" className="w-full" asChild>
				<DialogContent className="flex h-[90%] max-w-[80%] flex-col p-0 shadow-2xl">
					<DialogHeader className="flex h-fit space-y-1">
						<div>
							<div className="flex items-center space-x-2 border-b px-4 pb-2 pt-4 text-sm font-normal">
								<ChartSpline size={16} color="#76767f" />
								<span className="text-[#76767f]">Analysis</span>
							</div>
							<div className="flex w-full items-center">
								<div className="w-full space-y-1 px-4 pt-2">
									<DialogTitle className="text-2xl">Compare LCIA result</DialogTitle>
									<DialogDescription className="text-sm">
										Review and analyze the selected LCIA results. Ensure all data is accurate and consistent before proceeding, as
										changes cannot be reverted
									</DialogDescription>
								</div>
								<TabsList className="mr-3 mt-2 w-fit focus:ring-0">
									<TabsTrigger value="bar-chart">Bar Chart</TabsTrigger>
									<TabsTrigger value="stacked-chart">Stacked Chart</TabsTrigger>
								</TabsList>
							</div>
						</div>
					</DialogHeader>
					<div className="flex items-center space-x-2 px-4 text-sm">
						<div className="text-xs font-semibold">Impact Assessment Method:</div>
						<div className="rounded bg-[#8888881a] px-1 text-[12px] text-xs font-medium text-[#888888]">
							ReCiPe 2016 Midpoint v1.03 (I)
						</div>
					</div>
					<div className="flex min-h-[26px] items-center space-x-2 px-4 text-sm">
						<div className="text-xs font-semibold">Impact Category:</div>
						<DropdownMenu>
							{impactCategoryByProjectMethodQuery.isFetching ? (
								<Skeleton className="h-[23px] w-44 rounded-sm" />
							) : (
								<DropdownMenuTrigger className="flex items-center space-x-2 rounded px-1 text-sm font-medium text-[#888888] duration-200 hover:bg-gray-100">
									<span>{selectImpactCategory?.name}</span>
									<ChevronDown size={17} />
								</DropdownMenuTrigger>
							)}

							<DropdownMenuContent className="w-[320px]">
								{impactCategoryByProjectMethodQuery.data?.data.data.map((item) => (
									<DropdownMenuItem onClick={() => handleSetImpactCategory(item)} key={item.id} className="relative flex">
										<div
											className="mr-3"
											dangerouslySetInnerHTML={{
												__html: updateSVGAttributes({
													svgString: item.iconUrl,
													properties: {
														color: 'black',
														fill: 'none',
														height: 18,
														width: 18,
														strokeWidth: 2,
													},
												}),
											}}
										/>
										<span
											className={clsx(`text-[13px]`, {
												'font-medium': item.id === selectImpactCategory?.id,
											})}
										>
											{item.name}
										</span>
										{item.id === selectImpactCategory?.id && <Check strokeWidth={1.5} size={17} className="absolute right-2" />}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<TooltipProvider delayDuration={100}>
						<>
							<div className="h-[3.5%] w-full">
								<div className="flex items-center justify-center">
									{compareProjects.map((item, index) => (
										<div className="flex items-center justify-center" key={item.id}>
											{index === 0 &&
												(baseIndex === 0 ? (
													<div className="mr-3 rounded bg-green-300 px-1.5 py-0.5 text-xs text-green-900">Original</div>
												) : (
													<div className="mr-3 rounded bg-green-600 px-1.5 py-0.5 text-xs text-white">Comparison</div>
												))}

											<div className="flex items-center space-x-2">
												<div
													className={`h-[10px] w-[10px] rounded-[2px] ${index === 0 ? 'bg-[#16a34a]' : 'bg-[#3b82f6]'}`}
												></div>
												<div className="text-[15px] font-medium">{item.name}</div>
											</div>

											{index === 1 &&
												(baseIndex === 1 ? (
													<div className="ml-3 rounded bg-green-300 px-1.5 py-0.5 text-xs text-green-900">Original</div>
												) : (
													<div className="ml-3 rounded bg-green-600 px-1.5 py-0.5 text-xs text-white">Comparison</div>
												))}
											{compareProjects.length - 1 !== index && <div className="text-gray-00 mx-5 text-xs font-semibold">VS</div>}
										</div>
									))}
								</div>
							</div>
							<div className="h-full overflow-scroll">
								{/* Bar Chart */}
								<TabsContent value="bar-chart" asChild className="flex h-auto flex-col overflow-y-scroll">
									<>
										{impactCategoryByProjectMethodQuery.isFetching ? (
											<Skeleton className="mx-auto h-[30px] min-h-[35px] w-[500px]" />
										) : (
											<div className="min-h-[35px] text-center text-lg font-semibold">
												Comparison of Environmental Impact on
												<span className="ml-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
													{selectImpactCategory?.name}
												</span>
											</div>
										)}

										<div className="z-0 mx-5 flex justify-between">
											{Array(2)
												.fill(0)
												.map((_, index) => (
													<button
														onClick={() => setBasedIndex(index)}
														className={clsx(
															`translate-y-1/2 rounded-tl-md rounded-tr-md bg-green-600 px-2 py-1 text-sm font-medium text-white shadow transition-all hover:translate-y-0`,
															{
																'pointer-events-none invisible cursor-none': baseIndex === index,
																visible: baseIndex !== index,
															}
														)}
														key={index}
													>
														Set Base
													</button>
												))}
										</div>
										<div className="relative flex h-full justify-between px-2.5">
											{projectCompareOnChart.map((item, index) => (
												<ChartContainer
													className={clsx(
														`h-full w-[49.5%] rounded-tl-2xl rounded-tr-2xl border border-b-0 bg-white p-2 shadow`
													)}
													config={chartConfig}
													key={item.projectId}
												>
													<BarChart barSize={45} barCategoryGap={20} barGap={20} data={item.chartData} layout="vertical">
														<CartesianGrid vertical horizontal={false} />

														<XAxis type="number" dataKey="value" hide />
														<YAxis
															dataKey="abbr"
															type="category"
															tickLine={false}
															tickMargin={10}
															axisLine={false}
															tickSize={6}
															tickFormatter={(value) => value.slice(0, 3)}
														/>
														<ChartTooltip
															cursor={false}
															content={({ payload }) => {
																if (!payload || payload.length === 0) return null;
																const data = payload[0].payload;
																return (
																	<div className="flex h-full items-end space-x-2.5 rounded-lg border border-border/50 bg-white px-[10px] py-[6px] text-xs shadow-xl">
																		<div
																			className="before-floating-chart-item"
																			style={
																				{
																					'--before-bg-color':
																						index === 0 ? '#16a34a' : index === 1 ? '#3b82f6' : 'transparent',
																				} as React.CSSProperties
																			}
																		/>
																		{/* <div
																		className="h-full w-2.5 rounded-[2px]"
																		style={{ backgroundColor: `var(--color-${index === 0 ? 'first' : 'second'})` }}
																	/> */}
																		<div className="flex flex-col">
																			<span className="font-normal text-gray-500">{data.impactCategory}</span>
																			<span className="font-medium text-foreground">{data.name}</span>
																		</div>
																		<div className="mr-2 rounded font-medium">{data.value}</div>
																	</div>
																);
															}}
														/>

														<Bar
															dataKey="value"
															fill={`var(--color-${index === 0 ? 'first' : 'second'})`}
															strokeWidth={1.5}
															radius={8}
															activeIndex={compareProjects[0].impacts.findIndex(
																(item) => item.impactCategory.id === selectImpactCategory?.id
															)}
															activeBar={({ ...props }) => {
																return (
																	<Rectangle
																		{...props}
																		fillOpacity={0.8}
																		stroke="#1e293b"
																		strokeDasharray={4}
																		strokeDashoffset={4}
																	/>
																);
															}}
														/>
													</BarChart>
												</ChartContainer>
											))}
										</div>
										<div className="invisible flex h-[40px]">
											<div className="w-full bg-blue-200">total</div>
											<div className="w-full bg-green-200">total </div>
										</div>
										<div className="absolute bottom-0 left-2.5 right-2.5 flex h-[50px] space-x-3">
											{projectCompareByImpactCategory.map((item, index) => (
												<div key={index} className="flex w-full items-center justify-end border border-b-0 bg-white">
													{impactCategoryByProjectMethodQuery.isFetching ? (
														<div className="mr-5 flex items-start space-x-2">
															<Skeleton className="h-[26px] w-20" />
															<Skeleton className="h-[26px] w-32" />
														</div>
													) : (
														<div className="mr-3 flex items-center space-x-4 text-gray-500">
															<div className="">Total</div>
															<div className="font-semibold">
																{item.data?.value} {item.data?.impactCategory.midpointImpactCategory.unit.name}
															</div>
															{calculateDiffValue.isReduce !== null &&
																calculateDiffValue.value !== null &&
																baseIndex !== item.baseIndex && (
																	<div className="flex items-center space-x-2">
																		<Tooltip>
																			<TooltipTrigger asChild>
																				<div
																					className={`flex items-center space-x-1 text-sm font-medium ${calculateDiffValue.isReduce ? 'text-green-600' : 'text-red-600'}`}
																				>
																					<div
																						dangerouslySetInnerHTML={{
																							__html: formatNumberExponential(calculateDiffValue.value as number),
																						}}
																					/>
																					<span>%</span>
																				</div>
																			</TooltipTrigger>
																			<TooltipContent className="relative z-50 bg-green-900 font-medium text-white">
																				<p>{calculateDiffValue.value}</p>
																			</TooltipContent>
																		</Tooltip>

																		<div
																			className={`rounded-full p-[3px] ${calculateDiffValue.isReduce ? 'bg-green-600' : 'bg-red-600'}`}
																		>
																			{calculateDiffValue.isReduce ? (
																				<ArrowDown size={15} color="white" strokeWidth={3} />
																			) : (
																				<ArrowUp size={15} color="white" strokeWidth={3} />
																			)}
																		</div>
																	</div>
																)}
														</div>
													)}
												</div>
											))}
										</div>
									</>
								</TabsContent>

								{/* Stackle Chart */}
								<TabsContent className="h-full" value="stacked-chart">
									{impactCategoryByProjectMethodQuery.isFetching ? (
										<Skeleton className="mx-auto h-[30px] min-h-[35px] w-[500px]" />
									) : (
										<div className="min-h-[35px] text-center text-lg font-semibold">
											Contribution of Life Cycle Stages to
											<span className="ml-2 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
												{selectImpactCategory?.name}
											</span>
										</div>
									)}
									<div className="mx-auto h-full w-[80%]">
										<ChartContainer config={chartConfigs}>
											<BarChart accessibilityLayer data={lifeCycleStageContributeByImpactCategory}>
												<CartesianGrid vertical={false} />
												<XAxis dataKey="projectName" tickLine={false} tickMargin={10} axisLine={false} tick={true} />
												<ChartTooltip content={<ChartTooltipContent hideLabel />} />
												{lifeCycleStageContributeByImpactCategory?.length > 0 &&
													Object.keys(lifeCycleStageContributeByImpactCategory[0])
														.filter((item) => item !== 'projectName')
														.map((item, index, array) => {
															if (index === 0) {
																return <Bar dataKey={item} stackId="a" fill={color[index]} radius={[0, 0, 4, 4]} />;
															} else if (index === array.length - 1) {
																return <Bar dataKey={item} stackId="a" fill={color[index]} radius={[0, 0, 0, 0]} />;
															} else {
																return <Bar dataKey={item} stackId="a" fill={color[index]} radius={[4, 4, 0, 0]} />;
															}
														})}
											</BarChart>
										</ChartContainer>
									</div>
								</TabsContent>
							</div>
						</>
					</TooltipProvider>
				</DialogContent>
			</Tabs>
			<DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
		</Dialog>
	);
}

export default React.memo(FloatingControl);
