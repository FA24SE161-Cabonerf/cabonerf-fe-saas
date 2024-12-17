import { eDispatchType } from '@/@types/dispatch.type';
import { GetProjectListResponse } from '@/@types/project.type';
import { Checkbox } from '@/components/ui/checkbox';
import { AppContext } from '@/contexts/app.context';
import ItemProject from '@/pages/Dashboard/components/Project/item-project';
import { queryClient } from '@/queryClient';
import { Dot } from 'lucide-react';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

type Props = {
	data: GetProjectListResponse[];
	isPending: boolean;
};

function Skeleton() {
	return (
		<div className="col-span-full grid animate-pulse grid-cols-12 py-2.5">
			{/* Name and Impact Placeholder */}

			<div className="col-span-4 ml-4 flex items-center text-[13px] font-medium">
				<div className="mr-2 h-5 w-5 rounded-sm bg-gray-200"></div>
				<div className="h-4 w-3/4 rounded-sm bg-gray-200"></div>
			</div>

			{/* Avatar and Owner Placeholder */}
			<div className="col-span-2 flex items-center space-x-2 text-[13px] font-medium">
				<div className="h-8 w-8 rounded-full bg-gray-200"></div>
				<div className="h-4 w-1/2 rounded-md bg-gray-200"></div>
			</div>

			{/* Method Placeholder */}
			<div className="col-span-3 flex items-center text-[13px] font-medium">
				<div className="h-6 w-3/4 rounded-sm bg-gray-200"></div>
			</div>

			{/* Last Edit Placeholder */}
			<div className="col-span-2 flex items-center text-[13px] font-medium">
				<div className="h-4 w-2/3 rounded-md bg-gray-200"></div>
			</div>

			{/* Dropdown Placeholder */}
			<div className="col-span-1 flex items-center justify-start">
				<div className="h-4 w-8 rounded bg-gray-200"></div>
			</div>
		</div>
	);
}

export default function TableProject({ data, isPending }: Props) {
	const { organizationId } = useParams<{ organizationId: string }>();
	const {
		app: { selectCheckbox },
		dispatch,
	} = useContext(AppContext);

	const project = queryClient.getQueryData<{
		pageCurrent: string;
		pageSize: string;
		totalPage: string;
		projects: GetProjectListResponse[];
	}>(['projects-organization', organizationId]);

	const checkboxAll = () => {
		dispatch({
			type: eDispatchType.SELECT_ALL_CHECKBOX,
			payload: {
				projectIds: project?.projects.map((item) => item.id) ?? [],
				totalLength: project?.projects.length ?? 0,
			},
		});
	};

	return (
		<div className="h-full">
			{/* Table Header */}
			<div className="mt-3 grid grid-cols-12">
				<div className="col-span-full grid h-fit grid-cols-12 items-center rounded-lg border-[1.5px] bg-gray-50 px-3 py-1">
					<div className="col-span-1 flex pl-1">
						<Checkbox
							checked={project?.projects.length === selectCheckbox.length}
							onClick={checkboxAll}
							className="h-5 w-5 rounded-sm border-[1px] border-gray-200 bg-white shadow focus:border-[0.5px] data-[state=checked]:bg-gray-900 data-[state=checked]:text-white"
						/>
					</div>
					<div className="col-span-3 text-sm font-medium text-gray-500">Project name</div>
					<div className="col-span-2 text-sm font-medium text-gray-500">Created by</div>
					<div className="col-span-3 text-sm font-medium text-gray-500">Category</div>
					<div className="col-span-2 flex items-center text-sm font-medium text-gray-500">
						<span>Last Edit</span>
						<Dot strokeWidth={5} color="#16a34a" className="mx-0 animate-blink" />
					</div>
					<div className="col-span-1"></div>
				</div>
				{isPending ? (
					<>
						<Skeleton />
						<Skeleton />
						<Skeleton />
						<Skeleton />
					</>
				) : data.length === 0 ? (
					<div className="col-span-full mt-5 w-full text-center text-xs">No Projects Found. Start Creating Your First Project!</div>
				) : (
					<div className="col-span-full h-full">
						{data.map((item) => (
							<ItemProject item={item} key={item.id} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
