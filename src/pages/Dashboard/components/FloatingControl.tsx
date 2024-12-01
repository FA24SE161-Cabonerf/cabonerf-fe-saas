import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WarningSooner from '@/components/WarningSooner';
import { AppContext } from '@/contexts/app.context';
import { queryClient } from '@/queryClient';
import clsx from 'clsx';
import { ChartSpline, Check, GitCompare, User, X } from 'lucide-react';
import { useContext, useMemo, useState } from 'react';
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

export default function FloatingControl() {
	const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
	const [compareProjects, setCompareProjects] = useState<GetProjectListResponse[]>([]);
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
			chartData: item.impacts.map((item) => ({
				abbr: item.impactCategory.midpointImpactCategory.abbr,
				name: item.impactCategory.midpointImpactCategory.name,
				value: item.value,
			})),
		}));
	}, [compareProjects]);

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

		setCompareProjects(selectedProjects);
		setIsOpenDialog(true);
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
			<DialogContent className="flex h-[90%] max-w-[75%] flex-col overflow-hidden p-0 shadow-2xl">
				<DialogHeader className="h-fit space-y-1">
					<div className="flex items-center space-x-2 border-b px-4 pb-2 pt-4 text-sm font-normal">
						<ChartSpline size={16} color="#76767f" />
						<span className="text-[#76767f]">Analysis</span>
					</div>
					<div className="space-y-1 px-4 pt-2">
						<DialogTitle className="text-2xl">Compare LCIA result</DialogTitle>
						<DialogDescription className="text-sm">
							Review and analyze the selected LCIA results. Ensure all data is accurate and consistent before proceeding, as changes
							cannot be reverted
						</DialogDescription>
					</div>
				</DialogHeader>
				<div className="flex items-center space-x-2 px-4 text-sm">
					<div className="text-xs font-semibold">Current Method:</div>
					<div className="rounded bg-[#8888881a] px-1 text-[12px] text-xs font-medium text-[#888888]">
						ReCiPe 2016 Midpoint v1.03 (I)
					</div>
				</div>
				<div className="flex items-center space-x-2 px-4 text-sm">
					<div className="text-xs font-semibold">Current Method:</div>
					<DropdownMenu>
						<DropdownMenuTrigger>Climate change</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuItem>
								<User />
								<span>Profile</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Tabs defaultValue="bar-chart" className="w-full" asChild>
					<>
						<div className="h-[10%] w-full">
							<div className="flex items-center justify-center">
								{compareProjects.map((item, index) => (
									<div className="flex items-center justify-center" key={item.id}>
										<div className="flex items-center space-x-2">
											<div className={`h-[10px] w-[10px] rounded-[2px] ${index === 0 ? 'bg-[#16a34a]' : 'bg-[#3b82f6]'}`}></div>
											<div className="text-sm font-medium">{item.name}</div>
										</div>
										{compareProjects.length - 1 !== index && <div className="mx-5 text-xs font-semibold text-gray-400">VS</div>}
									</div>
								))}
							</div>

							<TabsList className="mx-auto w-full rounded-none bg-white focus:ring-0">
								<TabsTrigger value="bar-chart">Bar Chart</TabsTrigger>
								<TabsTrigger value="stacked-chart">Stacked Chart</TabsTrigger>
							</TabsList>
						</div>
						<div className="mt-1 h-full overflow-scroll pt-2">
							<TabsContent value="bar-chart" asChild className="flex h-[90%] flex-col overflow-y-scroll">
								<>
									<div className="relative flex h-full justify-between px-2">
										{projectCompareOnChart.map((item, index) => (
											<ChartContainer
												className="h-full w-[49.5%] rounded-tl-xl rounded-tr-xl border border-b-0 p-2 shadow"
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
																<div className="flex rounded-lg border border-border/50 bg-white px-[10px] py-[6px] text-xs shadow-xl">
																	<div className="mr-5 flex items-center space-x-2">
																		<div
																			className="h-2.5 w-2.5 rounded-[2px]"
																			style={{ backgroundColor: `var(--color-${index === 0 ? 'first' : 'second'})` }}
																		/>
																		<span className="font-medium text-foreground">{data.name}</span>
																	</div>
																	<div>{data.value}</div>
																</div>
															);
														}}
													/>

													<Bar
														dataKey="value"
														fill={`var(--color-${index === 0 ? 'first' : 'second'})`}
														strokeWidth={1}
														radius={8}
														activeIndex={1}
														activeBar={({ ...props }) => {
															return (
																<Rectangle
																	{...props}
																	fillOpacity={0.8}
																	stroke="black"
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
										<div className="w-full bg-blue-200">total 2</div>
										<div className="w-full bg-green-200">total </div>
									</div>
									<div className="absolute bottom-0 left-2 right-2 flex h-[50px] space-x-3">
										<div className="flex w-full items-center justify-end border border-b-0 bg-white">
											<div className="">Total</div>
											<div className="ml-5 mr-5 font-semibold">200</div>
										</div>
										<div className="flex w-full items-center justify-end border border-b-0 bg-white">
											<div className="">Total</div>
											<div className="mr-5 font-semibold">200</div>
										</div>
									</div>
								</>
							</TabsContent>
							<TabsContent value="stacked-chart">Change your password here.</TabsContent>
						</div>
					</>
				</Tabs>
			</DialogContent>
			<DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
		</Dialog>
	);
}
