import { PlaygroundDispatch } from '@/@types/dispatch.type';
import ProjectApis from '@/apis/project.apis';
import logo from '@/assets/logos/1024.png';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { areObjectsDifferent } from '@/utils/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { ChevronDown, History, Share } from 'lucide-react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

const projectInformation = z.object({
	name: z.string(),
	description: z.string(),
	location: z.string(),
});

type ProjectInformation = z.infer<typeof projectInformation>;

type Props = {
	id: string;
};

function PlaygroundHeader({ id }: Props) {
	const { playgroundState, playgroundDispatch } = useContext(PlaygroundContext);
	const [isOpenEditProject, setIsOpenEditProject] = useState<boolean>(false);
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
				console.log('SAVING');
				updateProjectInformationMutate.mutate(
					{ id, payload: changingValue },
					{
						onSuccess: (data) => {
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
							toast(error.message);
						},
					}
				);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpenEditProject, form, playgroundState, updateProjectInformationMutate.mutate, id]);

	const goBack = () => {
		navigate('/');
	};

	const onSubmit: SubmitHandler<ProjectInformation> = (data) => {
		console.log(data);
	};

	return (
		<div className="z-50 w-full bg-white">
			<div className="flex items-center justify-between border-b border-[#eeeeee]">
				<div className="flex items-center px-4 py-2">
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

				<Popover open={isOpenEditProject}>
					<PopoverTrigger ref={buttonRef} asChild onClick={() => setIsOpenEditProject(true)}>
						<button className="flex max-w-[430px] items-center space-x-2 rounded-md px-2 py-1.5 duration-150 hover:bg-gray-50">
							<span className="truncate text-[12px] font-semibold">{playgroundState.projectInformation?.name}</span>
							<kbd className="rounded bg-[#8888881a] p-0.5 text-[10px] font-bold text-[#888888]">name</kbd>
						</button>
					</PopoverTrigger>
					<PopoverContent ref={popoverRef} className="relative mt-5 rounded-[15px] border-[0.5px] shadow-xl" asChild>
						<div className="w-fit p-4 text-[12px]">
							<div className="absolute -top-[8px] left-1/2 -translate-x-1/2">
								<div className="h-0 w-0 border-b-[8px] border-l-[8px] border-r-[8px] border-b-white border-l-transparent border-r-transparent"></div>
							</div>
							<form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-12 items-center gap-3">
								<div className="col-span-4 font-medium text-gray-500">Name</div>
								<div className="col-span-8">
									<input
										{...form.register('name')}
										className="w-full rounded-[5px] bg-[#f3f3f3] px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-green-700"
									/>
								</div>
								<div className="col-span-4 font-medium text-gray-500">Description</div>
								<div className="col-span-8">
									<textarea
										{...form.register('description')}
										className="max-h-[200px] min-h-[50px] w-full min-w-[180px] max-w-[400px] resize rounded-[5px] bg-[#f3f3f3] px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-green-700"
									/>
								</div>
								<div className="col-span-4 font-medium text-gray-500">Location</div>
								<div className="col-span-8">Vietnam </div>
							</form>
						</div>
					</PopoverContent>
				</Popover>
				<div className="flex items-center space-x-7 py-3.5 pr-4">
					<button className="">
						<History size={17} />
					</button>
					<button className="">
						<Share size={17} />
					</button>

					{/* Caculate Button */}
				</div>
			</div>
		</div>
	);
}

export default React.memo(PlaygroundHeader);
