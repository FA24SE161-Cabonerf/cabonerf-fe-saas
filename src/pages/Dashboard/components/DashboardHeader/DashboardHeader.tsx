import ImpactMethodApis from '@/apis/impactMethod.apis';
import ProjectApis from '@/apis/project.apis';
import ButtonSubmitForm from '@/components/ButtonSubmitForm';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { queryClient } from '@/queryClient';
import { CreateProjectSchema, createProjectSchema } from '@/schemas/validation/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus, Telescope, Workflow } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function DashboardHeader() {
	const [openDialogCreateProject, setOpenDialogCreateProject] = useState<boolean>(false);
	const [openMethodDropdown, setOpenMethodDropdown] = useState<boolean>(false);
	const [value, setValue] = useState('');

	const form = useForm<CreateProjectSchema>({
		resolver: zodResolver(createProjectSchema),
		defaultValues: {
			description: '',
			location: 'Viet Nam',
			methodId: '',
			name: '',
			workspaceId: '6ccbff7f-9653-44c0-8ddb-e7728f12e5a0',
		},
	});

	const { data: impactMethods } = useQuery({
		queryKey: ['impact_methods'],
		queryFn: ImpactMethodApis.prototype.getImpactMethods,
		staleTime: 60_000,
	});

	useEffect(() => {
		if (openDialogCreateProject === false) {
			form.setValue('name', '');
			form.setValue('description', '');
			form.setValue('methodId', '');
		}
	}, [openDialogCreateProject, form]);

	const createProjectMutate = useMutation({
		mutationFn: (payload: CreateProjectSchema) => ProjectApis.prototype.createProject(payload),
	});

	const _impactMethods = useMemo(() => {
		return (
			impactMethods?.data.data.map(({ id, name, version, perspective }) => ({
				id,
				value: `${name}, ${version} (${perspective.abbr})`,
				label: `${name}, ${version} (${perspective.abbr})`,
			})) || []
		);
	}, [impactMethods?.data.data]);

	const onSubmit: SubmitHandler<CreateProjectSchema> = (data) => {
		createProjectMutate.mutate(data, {
			onSuccess: async (data) => {
				setOpenDialogCreateProject(false);
				toast(`Project has been created: ${data.data.data.projectId}`, {
					description: 'Sunday, December 03, 2023 at 9:00 AM',
					action: {
						label: 'Undo',
						onClick: () => alert('Processing'),
					},
				});
				queryClient.refetchQueries({ queryKey: ['projects'] });
			},
		});
	};

	return (
		<div className="mx-6 mt-3">
			<div className="flex items-end justify-between">
				<div className="flex flex-col leading-7">
					<span className="text-xl font-medium">Projects</span>
					<span className="font-normal tracking-wide text-gray-400">All Life Cycle Assessment projects in this workspace</span>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant={'outline'} className="space-x-1 rounded-sm font-normal">
						<span>Explore templates</span>
						<Telescope size={17} strokeWidth={2} />
					</Button>
					{/* Dialog Create Project */}
					<DropdownMenu>
						<DropdownMenuTrigger className="flex items-center space-x-1 rounded-sm bg-primary px-3 py-1.5 text-sm text-white outline-none">
							<span>Create LCA</span>
							<Plus size={17} strokeWidth={2} />
						</DropdownMenuTrigger>

						<DropdownMenuContent className="rounded-sm">
							<Dialog open={openDialogCreateProject} onOpenChange={setOpenDialogCreateProject}>
								<DialogTrigger
									onClick={() => setOpenDialogCreateProject(true)}
									className="w-full rounded-[3px] text-left duration-150 hover:bg-[#f4f4f5]"
								>
									<div className="flex items-center space-x-2 p-1">
										<Workflow size={16} />
										<span className="text-sm">Blank project</span>
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="text-2xl font-semibold">Creat your new project</DialogTitle>
										<DialogDescription>
											This action will initiate a new Life Cycle Assessment project, allowing you to analyze environmental
											impacts across the lifecycle of products, processes, or systems
										</DialogDescription>
									</DialogHeader>

									<Form {...form}>
										<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel htmlFor="name">Project name</FormLabel>
														<FormControl>
															<Input id="name" placeholder="This is your project name" {...field} />
														</FormControl>
														<FormMessage className="font-normal" />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormLabel htmlFor="description">Desription</FormLabel>
														<FormControl>
															<Textarea id="description" placeholder="Describe your project" {...field} />
														</FormControl>
														<FormMessage className="font-normal" />
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="methodId"
												render={() => (
													<FormItem className="relative items-start">
														<FormLabel htmlFor="methodId">Method</FormLabel>
														<FormControl>
															<div className="w-full">
																<Button
																	id="methodId"
																	variant="outline"
																	role="combobox"
																	type="button"
																	aria-expanded={openMethodDropdown}
																	onClick={() => setOpenMethodDropdown(!openMethodDropdown)}
																	className="w-full justify-between font-normal"
																>
																	{value
																		? _impactMethods.find((framework) => framework.value === value)?.label
																		: 'Choose impact method...'}
																	<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
																</Button>

																{openMethodDropdown && (
																	<div className="mt-2 w-full rounded-lg border shadow-md">
																		<Command>
																			<CommandInput placeholder="Search method..." />
																			<CommandList>
																				<CommandEmpty>No framework found.</CommandEmpty>
																				<CommandGroup>
																					{_impactMethods.map((framework) => (
																						<CommandItem
																							key={framework.value}
																							value={framework.value}
																							onSelect={(currentValue) => {
																								form.setValue(
																									'methodId',
																									form.getValues('methodId') === framework.id ? '' : framework.id
																								);
																								setValue(currentValue === value ? '' : currentValue);
																								setOpenMethodDropdown(false); // Close dropdown after selection
																							}}
																						>
																							<Check
																								className={cn(
																									'mr-2 h-4 w-4',
																									value === framework.value ? 'opacity-100' : 'opacity-0'
																								)}
																							/>
																							{framework.label}
																						</CommandItem>
																					))}
																				</CommandGroup>
																			</CommandList>
																		</Command>
																	</div>
																)}
															</div>
														</FormControl>

														<span className="text-[12.8px] text-red-500">{form.formState.errors.methodId?.message}</span>
													</FormItem>
												)}
											/>
											<ButtonSubmitForm
												className="h-10 w-full rounded-[6px] text-base font-normal"
												isPending={createProjectMutate.isPending}
												title="Create project"
												pendingTitle="Setting up project..."
											/>
										</form>
									</Form>
								</DialogContent>
							</Dialog>
						</DropdownMenuContent>
					</DropdownMenu>
					{/* Dialog Create Project */}
				</div>
			</div>

			<div className="mt-2">
				<div className="h-[140px] rounded-2xl bg-stone-100"></div>
			</div>
		</div>
	);
}
