import { GetProjectListResponse, Project } from '@/@types/project.type';
import MyAvatar from '@/components/MyAvatar';
import { Separator } from '@/components/ui/separator';
import { Dot } from 'lucide-react';

type Props = {
	data: GetProjectListResponse[];
};

export default function TableProject({ data }: Props) {
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

				<div className="col-span-full">
					<div className="grid grid-cols-12 py-2.5 hover:bg-gray-50">
						<div className="col-span-4 ml-2 text-[13px] font-medium">
							<div>Project name</div>
							<div>impact</div>
						</div>
						<div className="col-span-2 flex items-center space-x-2 text-[13px] font-medium">
							<MyAvatar fallBackContent="CN" urlAvatar="https://github.com/shadcn.png" />
							<span>Minh</span>
						</div>
						<div className="col-span-3 flex items-center text-[13px] font-medium">
							<div className="rounded-sm bg-[#ececec] px-2 py-0.5">Recipe 2016 Midpoint, v1.03 (I)</div>
						</div>
						<div className="col-span-2 flex items-center text-[13px] font-medium">Last Edit</div>
						<div className="col-span-1"></div>
					</div>
				</div>
			</div>
		</div>
	);
}
