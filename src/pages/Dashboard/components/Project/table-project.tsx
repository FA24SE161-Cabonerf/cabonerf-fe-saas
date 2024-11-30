import { GetProjectListResponse } from '@/@types/project.type';
import { Separator } from '@/components/ui/separator';
import ItemProject from '@/pages/Dashboard/components/Project/item-project';
import { Dot } from 'lucide-react';

type Props = {
	data: GetProjectListResponse[];
	isPending: boolean;
};

export default function TableProject({ data, isPending }: Props) {
	return (
		<div className="">
			{/* Table Header */}
			<div className="mt-3 grid grid-cols-12">
				<div className="col-span-4 text-xs font-medium">Title</div>
				<div className="col-span-2 text-xs font-medium">Created by</div>
				<div className="col-span-3 text-xs font-medium">Category</div>
				<div className="col-span-2 flex items-center text-xs font-medium">
					<span>Last Edit</span>
					<Dot strokeWidth={5} color="#16a34a" className="mx-0 animate-blink" />
				</div>
				<div className="col-span-1"></div>
				<Separator className="col-span-full mt-2" />
				{isPending ? (
					<div className="col-span-full grid animate-pulse grid-cols-12 py-2.5">
						{/* Name and Impact Placeholder */}
						<div className="col-span-4 ml-2 text-[13px] font-medium">
							<div className="mb-2 h-4 w-3/4 rounded-md bg-gray-200"></div>
							<div className="h-4 w-1/3 rounded-md bg-gray-200"></div>
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
				) : data.length === 0 ? (
					<div className="col-span-full mt-3 text-center text-sm">No projects found</div>
				) : (
					<div className="col-span-full">
						{data.map((item) => (
							<ItemProject item={item} key={item.id} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
