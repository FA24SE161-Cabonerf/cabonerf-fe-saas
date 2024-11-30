import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import WarningSooner from '@/components/WarningSooner';
import { AppContext } from '@/contexts/app.context';
import { queryClient } from '@/queryClient';
import clsx from 'clsx';
import { ChartSpline, Check, GitCompare, User, X } from 'lucide-react';
import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

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

	const onCompare = () => {
		const selectedProjects = project?.projects.filter((item) => app.selectCheckbox.includes(item.id));

		if (!selectedProjects) {
			return;
		}

		if (selectedProjects.length > 3) {
			toast(<WarningSooner message={`Only up to 3 projects using the same method can be compared at once.`} />, {
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
				<div className="flex w-[550px] rounded-[14px] border px-3 py-1.5 text-xs shadow-lg">
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
			<DialogContent className="flex h-[85%] max-w-[80%] flex-col space-y-0 p-0 shadow-2xl">
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
				<div className="flex items-center justify-center">
					{compareProjects.map((item, index) => (
						<div className="flex items-center justify-center">
							<div className="flex items-center space-x-2" key={item.id}>
								<div className="h-[10px] w-[10px] rounded-[2px] bg-green-500"></div>
								<div className="text-sm font-medium">{item.name}</div>
							</div>
							{compareProjects.length - 1 !== index && <div className="mx-5 text-xs font-semibold text-gray-400">VS</div>}
						</div>
					))}
				</div>
				<div className="flex h-full w-full space-x-3 overflow-scroll scroll-smooth">
					<div
						className={`relative flex h-full w-full flex-shrink-0 ${
							length === 1 ? 'grid-cols-1' : length === 2 ? 'grid-cols-2' : 'grid-cols-3'
						}`}
					>
						{Array(length)
							.fill(0)
							.map((_, index) => (
								<div key={index} className="relative h-full w-full border">
									<div className="h-full overflow-y-scroll">
										<div className="h-[1000px]"></div>
									</div>
									<div className="absolute bottom-0 left-0 right-0 top-[calc(100%-50px)] border bg-blue-300">123</div>
								</div>
							))}
					</div>
				</div>
			</DialogContent>
			<DialogOverlay className="bg-black/40 backdrop-blur-[2px]" />
		</Dialog>
	);
}
