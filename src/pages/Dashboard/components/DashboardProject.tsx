import ContributeLifeStage from '@/common/icons/ContributeLifeStage';
import Intensity from '@/common/icons/Intensity';
import OverviewIcon from '@/common/icons/OverviewIcon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

export default function DashboardProject() {
	const [isOpenDialog, setIsOpenDialog] = useState<boolean>(true);
	return (
		<Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
			<DialogContent className="h-[90%] max-w-[85%] overflow-y-scroll">
				<Tabs defaultValue="overview" className="mx-auto flex max-w-[60%] flex-col">
					<DialogTitle className="text-center text-base font-medium text-gray-400">LCA Report for:</DialogTitle>
					<DialogHeader className="mx-auto mt-10 flex w-full justify-center !text-center text-4xl font-bold">
						Tutorial #4 - Modeling Machine Energy Consumption 123 123 123 123
					</DialogHeader>
					<DialogDescription className="mx-auto mt-8 w-fit rounded bg-stone-100 px-4 py-0.5 text-[18px] font-semibold text-black">
						25.8 kg CO2-Eq per 1 Unit Mountain Bike
					</DialogDescription>

					<TabsList className="mx-auto mt-6 grid w-[60%] grid-cols-3 bg-white shadow-none">
						<TabsTrigger
							className="flex space-x-2 !rounded-none border-b py-3 !shadow-none transition-none data-[state=active]:border-b-[3px] data-[state=active]:border-green-600 data-[state=active]:text-green-800"
							value="overview"
						>
							<OverviewIcon height={20} width={20} />
							<span>Overview</span>
						</TabsTrigger>
						<TabsTrigger
							className="flex space-x-2 !rounded-none border-b py-3 !shadow-none transition-none data-[state=active]:border-b-[3px] data-[state=active]:border-green-600 data-[state=active]:text-green-800"
							value="intensity"
						>
							<Intensity height={20} width={20} />
							<span>Intensity</span>
						</TabsTrigger>

						<TabsTrigger
							className="flex space-x-2 !rounded-none border-b py-3 !shadow-none transition-none data-[state=active]:border-b-[3px] data-[state=active]:border-green-600 data-[state=active]:text-green-800"
							value="lifecycle"
						>
							<ContributeLifeStage height={20} width={20} />
							<span>Life Cycle Stage</span>
						</TabsTrigger>
					</TabsList>

					<div className="mt-7">
						<TabsContent value="overview">
							<div className="p-4">
								<h2 className="mb-8 mt-6 text-center text-xl font-medium">Life cycle assessment overview</h2>

								<div className="h-fit w-full border px-6 py-2">
									<div className="grid grid-cols-12 border-b border-gray-200 py-3">
										<div className="col-span-3 font-medium text-gray-600">Project Description:</div>
										<div className="col-span-9">Product A ádasd</div>
									</div>
									<div className="grid grid-cols-12 border-b border-gray-200 py-4">
										<div className="col-span-3 font-medium text-gray-600">Project Owner:</div>
										<div className="col-span-9">Product A ádasd</div>
									</div>
									<div className="grid grid-cols-12 border-b border-gray-200 py-4">
										<div className="col-span-3 font-medium text-gray-600">Functional Unit:</div>
										<div className="col-span-9">Product A ádasd</div>
									</div>
									<div className="grid grid-cols-12 border-b border-gray-200 py-4">
										<div className="col-span-3 font-medium text-gray-600">Project Life Cycle:</div>
										<div className="col-span-9">Product A ádasd</div>
									</div>
									<div className="grid grid-cols-12 border-b border-gray-200 py-4">
										<div className="col-span-3 font-medium text-gray-600">Created On:</div>
										<div className="col-span-9">Product A ádasd</div>
									</div>
									<div className="grid grid-cols-12 py-4">
										<div className="col-span-3 font-medium text-gray-600">Reporting Standard:</div>
										<div className="col-span-9 space-y-4 font-medium leading-normal text-gray-800">
											This report adheres to the
											<a
												target="_blank"
												className="mx-1 font-medium text-green-700 underline decoration-dotted hover:text-green-500"
												href="https://ghgprotocol.org/product-standard"
											>
												Greenhouse Gas Protocol Product Life Cycle Accounting and Reporting Standard
											</a>
											which accounts for all emissions and removals within the defined boundary limits, covering both biogenic
											and non-biogenic sources.
											<div>
												Purchased carbon offsets or credits are excluded from the assessment to maintain transparency and
												accuracy.
											</div>
										</div>
									</div>
								</div>
							</div>
						</TabsContent>
					</div>
				</Tabs>
			</DialogContent>
			<DialogOverlay className="bg-black/20 backdrop-blur-[2px]" />
		</Dialog>
	);
}
