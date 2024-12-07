import { eDispatchType } from '@/@types/dispatch.type';
import ContributeLifeStage from '@/common/icons/ContributeLifeStage';
import Intensity from '@/common/icons/Intensity';
import OverviewIcon from '@/common/icons/OverviewIcon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AppContext } from '@/contexts/app.context';
import { formatDate, formatLargeNumber, updateSVGAttributes } from '@/utils/utils';
import React, { useContext, useEffect, useState } from 'react';

function DashboardProject() {
	const {
		app: { previewProject },
		dispatch,
	} = useContext(AppContext);
	const [isOpenDialog, setIsOpenDialog] = useState<boolean>(Boolean(previewProject));

	useEffect(() => {
		if (previewProject !== undefined) {
			setIsOpenDialog(true);
		} else {
			setIsOpenDialog(false);
		}
	}, [previewProject]);

	const handleDialogClose = (isOpen: boolean) => {
		setIsOpenDialog(isOpen);
		if (!isOpen) {
			dispatch({ type: eDispatchType.CLEAR_PROJECT_PREVIEW });
		}
	};

	return (
		<Dialog open={isOpenDialog} onOpenChange={handleDialogClose}>
			<DialogContent className="h-[90%] max-w-[75%] overflow-y-scroll">
				<Tabs defaultValue="overview" className="mx-auto flex max-w-[70%] flex-col">
					<DialogTitle className="text-center text-xl font-medium text-gray-400">LCA Report for:</DialogTitle>
					<DialogHeader className="mx-auto mt-10 flex w-full justify-center !text-center text-4xl font-bold">
						{previewProject?.name}
					</DialogHeader>
					<DialogDescription className="mx-auto mt-8 w-fit rounded bg-stone-100 px-4 py-0.5 text-[18px] font-semibold text-black">
						25.8 kg CO2-Eq per {previewProject?.functionalUnit}
					</DialogDescription>

					<TabsList className="mx-auto mt-6 grid w-[500px] grid-cols-3 bg-white shadow-none">
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

					<TabsContent value="overview" className="mt-7">
						<div className="p-4">
							<h2 className="mb-8 mt-6 text-center text-xl font-medium">Life cycle assessment overview</h2>

							<div className="h-fit w-full border px-6 py-2">
								<div className="grid grid-cols-12 border-b border-gray-200 py-3">
									<div className="col-span-3 font-normal text-gray-600">Project Description:</div>
									<div className="col-span-9 font-medium capitalize">
										{previewProject?.description === '' ? 'No description provided' : previewProject?.description}
									</div>
								</div>
								<div className="grid grid-cols-12 border-b border-gray-200 py-4">
									<div className="col-span-3 font-normal text-gray-600">Project Owner:</div>
									<div className="col-span-9 font-medium">{previewProject?.owner.fullName}</div>
								</div>
								<div className="grid grid-cols-12 border-b border-gray-200 py-4">
									<div className="col-span-3 font-normal text-gray-600">Functional Unit:</div>
									<div className="col-span-9 font-medium">{previewProject?.functionalUnit}</div>
								</div>
								<div className="grid grid-cols-12 border-b border-gray-200 py-4">
									<div className="col-span-3 font-normal text-gray-600">Project Life Cycle:</div>
									<div className="col-span-9 font-medium"></div>
								</div>
								<div className="grid grid-cols-12 border-b border-gray-200 py-4">
									<div className="col-span-3 font-normal text-gray-600">Created On:</div>
									<div className="col-span-9 font-medium">{formatDate(previewProject?.modifiedAt as string)}</div>
								</div>
								<div className="grid grid-cols-12 py-4">
									<div className="col-span-3 font-normal text-gray-600">Reporting Standard:</div>
									<div className="col-span-9 space-y-4 font-medium leading-normal text-gray-800">
										This report adheres to the
										<a
											target="_blank"
											className="mx-1 font-medium text-green-700 underline decoration-dotted hover:text-green-500"
											href="https://ghgprotocol.org/product-standard"
										>
											Greenhouse Gas Protocol Product Life Cycle Accounting and Reporting Standard
										</a>
										which accounts for all emissions and removals within the defined boundary limits, covering both biogenic and
										non-biogenic sources.
										<div>
											Purchased carbon offsets or credits are excluded from the assessment to maintain transparency and accuracy.
										</div>
									</div>
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent value="intensity" className="mt-7">
						<div className="p-4">
							<h2 className="mb-8 mt-6 text-center text-xl font-medium">Life cycle assessment overview</h2>

							<TooltipProvider>
								<div className="mx-auto grid h-fit w-auto grid-cols-12">
									{previewProject?.intensity &&
										previewProject.intensity.map((item) => (
											<div
												key={item.id}
												className="col-span-3 h-auto flex-col items-center justify-center space-y-3 border-[0.5px] border-gray-300 p-4"
											>
												<Tooltip>
													<div className="flex items-center space-x-2">
														<div className="flex w-full items-center justify-between space-x-1">
															<div
																className="mr-2 inline-block rounded-full bg-green-200 p-[6px] text-green-600"
																dangerouslySetInnerHTML={{
																	__html: updateSVGAttributes({
																		svgString: item.icon,
																		properties: {
																			color: 'currentColor',
																			fill: 'none',
																			height: 19,
																			width: 19,
																			strokeWidth: 2,
																		},
																	}),
																}}
															/>
															<TooltipTrigger id={item.id} asChild>
																<span className="w-full text-sm font-medium">{item.category}</span>
															</TooltipTrigger>
														</div>
														<TooltipContent id={item.id} asChild className="text-black">
															<div className="w-[200px] rounded-lg border-[0.5px] bg-white p-2 shadow">
																<div className="mb-2 font-bold">Reference</div>
																<p>
																	This value is based on
																	<a
																		target="_blank"
																		className="mx-1 font-medium text-green-700 underline decoration-dotted hover:text-green-500"
																		href={item.ref}
																	>
																		{item.ref}
																	</a>
																</p>
															</div>
														</TooltipContent>
													</div>
													<div className="text-center text-xl font-bold">
														{formatLargeNumber(item.value)} {item.unit}
													</div>
													<div className="text-center text-sm font-normal">{item.description !== '' && item.description}</div>
												</Tooltip>
											</div>
										))}
								</div>
							</TooltipProvider>
						</div>
					</TabsContent>
				</Tabs>
			</DialogContent>
			<DialogOverlay className="bg-black/20 backdrop-blur-[2px]" />
		</Dialog>
	);
}

export default React.memo(DashboardProject);
