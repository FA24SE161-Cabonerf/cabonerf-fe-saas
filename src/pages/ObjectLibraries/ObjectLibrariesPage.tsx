import ObjectLibraryApis from '@/apis/objectLibrary.apis';
import { Separator } from '@/components/ui/separator';
import TAB_TITLES from '@/constants/tab.titles';
import ObjectLibrariesHeader from '@/pages/ObjectLibraries/components/ObjectLibrariesHeader';
import { formatWithExponential, timeAgo, updateSVGAttributes } from '@/utils/utils';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ObjectLibrariesPage() {
	const params = useParams<{ organizationId: string }>();
	const { data } = useQuery({
		queryKey: ['object-libraries', params.organizationId],
		queryFn: ({ queryKey }) => {
			return ObjectLibraryApis.prototype.getListObjectLibrary({
				organizationId: queryKey[1] as string, // Use explicit typing for safety
				keyword: queryKey[2] ?? '',
				systemBoundaryId: queryKey[3] as string,
				pageCurrent: 1,
				pageSize: 6,
			});
		},
		refetchOnMount: true,
		placeholderData: (previousData) => previousData,
	});
	console.log(data?.objectLibraryList);
	useEffect(() => {
		document.title = `Object Libraries - ${TAB_TITLES.HOME}`;
	}, []);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.7, ease: 'easeOut' }}
			className="flex h-full flex-col ease-in"
		>
			<ObjectLibrariesHeader />
			<Separator className="shadow-sm" />
			<div className="mx-6 my-3">
				{/* Search */}
				<div>Search</div>
				<div className="grid grid-cols-12 gap-3">
					{data?.objectLibraryList.map((item) => (
						<div
							key={item.id}
							className="group relative h-[300px] [perspective:1000px] sm:col-span-6 md:col-span-4 md:h-[250px] lg:col-span-3 xl:col-span-3"
						>
							{/* Card wrapper with 3D transform and hover rotation */}
							<div className="relative h-full w-full transition-transform duration-200 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
								{/* Front Side */}
								<div className="absolute inset-0 flex cursor-pointer flex-col justify-between rounded-[28px] border p-4 shadow [backface-visibility:hidden]">
									<div className="w-fit rounded-md bg-gray-100 p-1.5">
										<Package size={20} />
									</div>
									<div className="text-lg font-bold">{item.name}</div>
									<div className="">{timeAgo(item.createdAt)}</div>
								</div>

								{/* Back Side */}
								<div className="absolute inset-0 h-full cursor-pointer overflow-y-scroll rounded-[28px] border px-5 py-5 shadow-inner [backface-visibility:hidden] [transform:rotateY(180deg)]">
									<div className="grid grid-cols-2 gap-x-2 gap-y-4">
										{item.impacts.map((item) => (
											<div className="col-span-1 flex items-center justify-between space-x-2 text-xs" key={item.id}>
												<div className="flex items-center space-x-1">
													<div
														className="w-[20%]"
														dangerouslySetInnerHTML={{
															__html: updateSVGAttributes({
																svgString: item.impactCategory.iconUrl,
																properties: {
																	height: 17,
																	width: 17,
																	color: 'black',
																	fill: 'none',
																},
															}),
														}}
													/>
												</div>
												<div className="flex w-[80%] justify-between">
													<div className="ml-2 rounded bg-gray-100 px-[1px] text-[11px] font-medium">
														{formatWithExponential(item.unitLevel)}
													</div>
													<div className="text-[11px] font-medium">{item.impactCategory.midpointImpactCategory.unit.name}</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
