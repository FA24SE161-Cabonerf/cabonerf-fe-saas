import { PlaygroundDispatch } from '@/@types/dispatch.type';
import ObjectLibraryApis from '@/apis/objectLibrary.apis';
import ProjectApis from '@/apis/project.apis';
import logo from '@/assets/logos/1024.png';
import ErrorSooner from '@/components/ErrorSooner';
import MyAvatar from '@/components/MyAvatar';
import SuccessSooner from '@/components/SuccessSooner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogOverlay, DialogTitle } from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import config from '@/config';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { isBadRequestError } from '@/utils/error';
import { getTokenFromLocalStorage, TOKEN_KEY_NAME } from '@/utils/local_storage';
import { areObjectsDifferent } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation } from '@tanstack/react-query';
import { getViewportForBounds, useReactFlow } from '@xyflow/react';
import axios from 'axios';
import clsx from 'clsx';
import { toPng } from 'html-to-image';
import { ChevronDown, Download } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast as hotToast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const projectInformation = z.object({
	name: z.string(),
	description: z.string().optional(),
	location: z.string(),
});

type ProjectInformation = z.infer<typeof projectInformation>;

type Props = {
	id: string;
	users: { userId: string; userName: string; userAvatar: string; projectId: string }[];
	projectName: string;
};

function downloadImage(dataUrl: string, projectName: string) {
	const a = document.createElement('a');

	a.setAttribute('download', `${projectName}.png`);
	a.setAttribute('href', dataUrl);
	a.click();
}

function PlaygroundHeader({ id, users, projectName }: Props) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { getNodes, getNodesBounds } = useReactFlow();
	const { playgroundState, playgroundDispatch } = useContext(PlaygroundContext);
	const [isOpenEditProject, setIsOpenEditProject] = useState<boolean>(false);
	const [isOpenDownloadImage, setIsOpenDownloadImage] = useState<boolean>(false);
	const [imageDataBase64, setImageDataBase64] = useState<string>('');
	const popoverRef = useRef<HTMLDivElement>(null);
	const buttonRef = useRef<HTMLButtonElement>(null);
	const navigate = useNavigate();

	const form = useForm<ProjectInformation>({
		resolver: zodResolver(projectInformation),
	});

	const updateProjectInformationMutate = useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: { name: string; description: string; location: string } }) =>
			ProjectApis.prototype.updateProject(id, payload),
	});

	const saveToObjectLibraryMutate = useMutation({
		mutationFn: (projectId: string) => ObjectLibraryApis.prototype.createObjectLibrary({ projectId }),
	});

	useEffect(() => {
		form.setValue('name', playgroundState.projectInformation?.name ?? '');
		form.setValue('description', playgroundState.projectInformation?.description ?? '');
		form.setValue('location', playgroundState.projectInformation?.location ?? '');
	}, [form, playgroundState.projectInformation]);

	useEffect(() => {
		const handleCloseEditProjectInformation = (event: MouseEvent) => {
			const target = event.target as Node;
			if (popoverRef.current && !popoverRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
				setIsOpenEditProject(false);
			}
		};

		document.addEventListener('click', handleCloseEditProjectInformation);

		return () => {
			document.removeEventListener('click', handleCloseEditProjectInformation);
		};
	}, []);

	useEffect(() => {
		const currentInformation = playgroundState.projectInformation;
		const changingValue = form.getValues();

		if (currentInformation !== undefined && changingValue !== undefined) {
			if (!isOpenEditProject && areObjectsDifferent(currentInformation, changingValue) === true) {
				hotToast.promise(
					new Promise((resolve, reject) => {
						updateProjectInformationMutate.mutate(
							{ id, payload: { ...changingValue, description: changingValue.description ?? '' } },
							{
								onSuccess: (data) => {
									resolve(true);
									playgroundDispatch({
										type: PlaygroundDispatch.SET_PROJECT_INFOR,
										payload: {
											description: data.data.data.description,
											location: data.data.data.location,
											name: data.data.data.name,
										},
									});
								},
								onError: (error) => {
									reject(false);
									toast(error.message);
								},
							}
						);
					}),
					{
						loading: <p className="text-sm">Updating your project...</p>,
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
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenEditProject, form, playgroundState, updateProjectInformationMutate.mutate, id]);

	const onExportToPng = async () => {
		setIsLoading(true);

		hotToast.promise(
			new Promise<string>((resolve, reject) => {
				const nodes = getNodes();
				const nodesBounds = getNodesBounds(nodes);

				const viewport = getViewportForBounds(
					nodesBounds,
					nodesBounds.width,
					nodesBounds.height,
					0.5,
					2,
					// getViewportForBounds returns NaN
					0.1
				);

				toPng(document.querySelector('.react-flow__viewport') as HTMLElement, {
					backgroundColor: '#ffffff',
					width: nodesBounds.width,
					height: nodesBounds.height,
					style: {
						transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
					},
				})
					.then((value) => {
						setIsLoading(false);

						resolve(value);
					})
					.catch((error) => {
						reject(error);
					});
			}),
			{
				loading: <p className="text-sm">Preparing your image...</p>,
				success: (data: string) => {
					setIsOpenDownloadImage(true);
					setImageDataBase64(data);
					return <div />;
				},
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
	};

	const goBack = () => {
		navigate('/');
	};

	const handleSaveToObjectLibrary = () => {
		setIsLoading(true);
		hotToast.promise(
			new Promise((resolve, reject) => {
				saveToObjectLibraryMutate.mutate(id, {
					onSuccess: (data) => {
						toast(<SuccessSooner message={data.data.message} />, {
							className: 'rounded-2xl p-2 w-[350px]',
							style: {
								border: `1px solid #dedede`,
								backgroundColor: `#fff`,
							},
						});
						setIsLoading(false);

						resolve(true);
					},
					onError: (error) => {
						if (isBadRequestError<{ data: null; message: string; status: string }>(error)) {
							toast(<ErrorSooner message={error.response?.data.message as string} />, {
								className: 'rounded-2xl p-2 w-[350px]',
								style: {
									border: `1px solid #dedede`,
									backgroundColor: `#fff`,
								},
							});
							reject(false);
						}
					},
				});
			}),
			{
				loading: <p className="text-sm">Saving your project to the Object Library...</p>,
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
	};

	const handleExportToExcel = async () => {
		setIsLoading(true);
		hotToast.promise(
			new Promise((resolve, reject) => {
				axios({
					method: 'post',
					url: `${config.BASE_URL}/projects/export`,
					responseType: 'blob', // Set response type to blob
					headers: {
						Authorization: `Bearer ${getTokenFromLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN) as string}`,
					},
					data: {
						projectId: id,
					},
				})
					.then((response) => {
						setIsLoading(false);

						resolve(true);
						// Create a blob from the response data
						const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

						// Create a link element
						const url = window.URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = url;
						link.setAttribute('download', `[CABONERF]-${projectName}.xlsx`); // Set the desired file name

						// Automatically trigger the download
						link.style.display = 'none';
						document.body.appendChild(link);
						link.click();

						// Clean up
						document.body.removeChild(link);
						window.URL.revokeObjectURL(url);
					})
					.catch((err) => {
						reject(err);
					});
			}),
			{
				loading: <p className="text-sm">Preparing your Excel file...</p>,
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
	};

	const handleClose = (isOpen: boolean) => {
		if (isOpen === false) {
			setImageDataBase64('');
		}
		setIsOpenDownloadImage(isOpen);
	};

	return (
		<Dialog open={isOpenDownloadImage} onOpenChange={handleClose}>
			<TooltipProvider>
				<div className="z-50 w-full bg-white">
					<div className="flex border-b border-[#eeeeee]">
						<div className="flex w-1/2 items-center px-4 py-3">
							<DropdownMenu>
								<DropdownMenuTrigger className="outline-none" autoFocus={false} asChild>
									<button className="flex items-center justify-center space-x-2 rounded-[8px] border-[1px] border-gray-50 px-2 py-2 shadow-md hover:bg-gray-50">
										<img src={logo} className="h-3.5 w-3.5" />
										<ChevronDown color="#1f2937" strokeWidth={3} size={16} />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent className="z-50 ml-3 mt-1 w-[200px] border-[0.5px] bg-white">
									<DropdownMenuItem className="text-xs" onClick={goBack}>
										Go to Dashboard
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuSub>
										<DropdownMenuSubTrigger className="text-xs">
											<span>File</span>
										</DropdownMenuSubTrigger>
										<DropdownMenuPortal>
											<DropdownMenuSubContent className="ml-2 border-none bg-white">
												<DropdownMenuItem className="text-xs">
													<span>New</span>
												</DropdownMenuItem>
											</DropdownMenuSubContent>
										</DropdownMenuPortal>
									</DropdownMenuSub>
									<DropdownMenuItem className="text-xs">Team</DropdownMenuItem>
									<DropdownMenuItem className="text-xs">Subscription</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex w-1/2 items-center justify-between">
							<Popover open={isOpenEditProject}>
								<PopoverTrigger ref={buttonRef} asChild onClick={() => setIsOpenEditProject(true)}>
									<button className="flex max-w-[430px] -translate-x-1/2 items-center space-x-2 rounded-md px-2 py-1.5 duration-150 hover:bg-gray-50">
										<span className="truncate text-[12px] font-semibold">{playgroundState.projectInformation?.name}</span>
										<kbd className="rounded bg-[#8888881a] px-1 text-[12px] font-semibold text-[#888888]">LCA</kbd>
									</button>
								</PopoverTrigger>
								<PopoverContent ref={popoverRef} className="relative mt-5 rounded-[20px] border-[0.5px] shadow-xl" asChild>
									<div className="w-fit p-4 text-[12px]">
										<div className="absolute -top-[7px] left-1/2 -translate-x-1/2">
											<div className="h-0 w-0 border-b-[8px] border-l-[8px] border-r-[8px] border-b-white border-l-transparent border-r-transparent"></div>
										</div>
										<form className="grid grid-cols-12 items-center gap-3">
											<div className="col-span-4 font-medium text-gray-500">Name</div>
											<div className="col-span-8">
												<input
													id="name"
													autoComplete="off"
													{...form.register('name')}
													className="w-full rounded-[8px] bg-[#f3f3f3] px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-green-700"
												/>
											</div>
											<div className="col-span-4 font-medium text-gray-500">Description</div>
											<div className="col-span-8">
												<textarea
													id="description"
													autoComplete="off"
													{...form.register('description')}
													className="max-h-[200px] min-h-[60px] w-full min-w-[200px] max-w-[400px] resize rounded-[8px] bg-[#f3f3f3] px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-green-700"
												/>
											</div>
											<div className="col-span-4 font-medium text-gray-500">Location</div>
											<div className="col-span-8">Vietnam </div>
										</form>
									</div>
								</PopoverContent>
							</Popover>
							<div className="mr-3 flex items-center space-x-2.5">
								<div className="group flex space-x-1">
									{users.map((item, index) => (
										<Tooltip key={item.userId} delayDuration={200}>
											<TooltipTrigger id={item.userId} className="relative">
												<MyAvatar
													className={clsx(
														`h-7 w-7 rounded-full border-[0.5px] bg-white ring-2 ring-white transition-transform duration-200 ease-in-out`,
														{
															'group-hover:translate-x-0': true, // Hover effect for all avatars
															'translate-x-1/2': index !== users.length - 1, // Apply translate only for avatars except the last one
														}
													)}
													urlAvatar={item.userAvatar}
													fallBackContent=""
												/>
											</TooltipTrigger>
											<TooltipContent asChild id={item.userId}>
												<div className="relative mt-1 overflow-visible border-[0.5px] border-green-600 bg-green-600 p-2 text-white">
													{/* Triangle indicator */}
													<div className="absolute -top-[5px] left-1/2 -translate-x-1/2 border-b-[5px] border-l-[5px] border-r-[5px] border-b-green-600 border-l-transparent border-r-transparent" />
													{/* Tooltip content */}
													<div>{item.userName}</div>
												</div>
											</TooltipContent>
										</Tooltip>
									))}
								</div>
								<button className="rounded-sm bg-[#f3f3f3] px-2.5 py-1.5 text-xs font-medium text-[#333333] hover:bg-gray-200">
									Invite
								</button>
								<DropdownMenu>
									<DropdownMenuTrigger disabled={isLoading} asChild>
										<button
											className={clsx(
												`flex min-w-[90px] items-center space-x-2 rounded-sm px-2.5 py-1.5 text-xs font-medium text-white shadow-md shadow-green-200 transition-all hover:bg-opacity-90`,
												{
													'bg-gray-300': isLoading === true,
													'bg-green-600': isLoading === false,
												}
											)}
										>
											<span>Publish</span>
											{isLoading ? (
												<ReloadIcon className="h-3 w-3 animate-spin" />
											) : (
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													width={16}
													height={16}
													color={'#fff'}
													fill={'none'}
												>
													<path
														d="M12 14.5L12 4.5M12 14.5C11.2998 14.5 9.99153 12.5057 9.5 12M12 14.5C12.7002 14.5 14.0085 12.5057 14.5 12"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M20 16.5C20 18.982 19.482 19.5 17 19.5H7C4.518 19.5 4 18.982 4 16.5"
														stroke="currentColor"
														strokeWidth="1.5"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											)}
										</button>
									</DropdownMenuTrigger>
									<DropdownMenuContent className="mr-2">
										<DropdownMenuLabel className="cursor-pointer text-xs">Publish options</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem onSelect={handleExportToExcel} className="cursor-pointer text-xs">
											Export to Excel
										</DropdownMenuItem>
										<DropdownMenuItem onSelect={onExportToPng} className="cursor-pointer text-xs">
											Export to PNG
										</DropdownMenuItem>
										<DropdownMenuItem className="cursor-pointer text-xs" onSelect={handleSaveToObjectLibrary}>
											Save as <span className="ml-1 font-bold text-green-700">Object Library</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
					</div>
				</div>
			</TooltipProvider>

			<DialogContent className="max-w-[700px]">
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						<img src={imageDataBase64} />
					</DialogDescription>
					<div className="flex w-full space-x-1">
						<Button
							onClick={() => setIsOpenDownloadImage(false)}
							variant={'outline'}
							className="flex w-full items-center justify-center space-x-2 border-none bg-gray-100"
						>
							<span>Cancel</span>
						</Button>
						<Button
							onClick={() => {
								downloadImage(imageDataBase64, projectName);
								setIsOpenDownloadImage(false);
							}}
							className="flex w-full items-center justify-center space-x-2 border-none"
						>
							<span>Download</span>
							<Download size={15} />
						</Button>
					</div>
				</DialogHeader>
			</DialogContent>
			<DialogOverlay className="bg-black/10 backdrop-blur-[2px]" />
		</Dialog>
	);
}

export default React.memo(PlaygroundHeader);
