import ImpactMethodApis from '@/apis/impactMethod.api';
import ImpactMethodComboBox from '@/components/ImpactMethodComboBox';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CreateProjectSchema, createProjectSchema } from '@/schemas/validation/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { FileUp, Plus, Telescope, Workflow } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function DashboardHeader() {
	const [selectedImpactMethodId, setSelectedImpactMethodId] = useState<string>('');

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

	const { data: impactMethods, isLoading: impact_methods_loading } = useQuery({
		queryKey: ['impact_methods'],
		queryFn: ImpactMethodApis.prototype.getImpactMethods,
		staleTime: 60_000,
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

	const updateSelectedImpactMethod = (id: string) => {
		setSelectedImpactMethodId(id);
	};

	const onSubmit: SubmitHandler<CreateProjectSchema> = (data) => {
		console.log(data);
	};

	return (
		<div className="mx-6 mt-3">
			<div className="flex items-end justify-between">
				<div className="flex flex-col leading-7">
					<span className="text-2xl font-medium">Projects</span>
					<span className="font-normal tracking-wide text-gray-400">
						All Life Cycle Assessment projects in this workspace
					</span>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant={'outline'} className="space-x-1 rounded-sm font-normal">
						<span>Explore templates</span>
						<Telescope size={17} strokeWidth={2} />
					</Button>
					{/* Dialog Create Project */}
					<Dialog>
						<DropdownMenu>
							<DropdownMenuTrigger className="flex items-center space-x-1 rounded-sm bg-primary px-3 py-1.5 text-sm text-white outline-none">
								<span>Create LCA</span>
								<Plus size={17} strokeWidth={2} />
							</DropdownMenuTrigger>
							<DropdownMenuContent className="rounded-sm">
								<DialogTrigger>
									<DropdownMenuItem
										onSelect={(e) => e.preventDefault()}
										className="space-x-1.5 rounded-[3.5px]"
									>
										<Workflow size={17} strokeWidth={2} />
										<span>Blank Project</span>
									</DropdownMenuItem>
								</DialogTrigger>

								<DialogContent className="outline-none">
									<DialogHeader>
										<DialogTitle className="text-xl font-semibold">Create your new LCA project</DialogTitle>
										<DialogDescription className="">
											This action will initiate a new Life Cycle Assessment project, allowing you to analyze
											environmental impacts across the lifecycle of products, processes, or systems.
										</DialogDescription>
									</DialogHeader>
									<Form {...form}>
										<form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
											<FormField
												control={form.control}
												name="name"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Project name</FormLabel>
														<FormControl>
															<Input
																className="rounded-sm"
																placeholder="Enter your project name"
																{...field}
															/>
														</FormControl>
														<FormDescription>This is your public project name.</FormDescription>
													</FormItem>
												)}
											/>
											<FormField
												control={form.control}
												name="description"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Description</FormLabel>
														<FormControl>
															<Input
																className="rounded-sm"
																placeholder="Enter your description name"
																{...field}
															/>
														</FormControl>
														<FormDescription>This is your description of project.</FormDescription>
													</FormItem>
												)}
											/>

											<ImpactMethodComboBox
												isLoading={impact_methods_loading}
												title="Select impact method"
												onSelected={updateSelectedImpactMethod}
												data={_impactMethods}
											/>
											<Button type="submit">Submit</Button>
										</form>
									</Form>
								</DialogContent>

								<DropdownMenuItem className="space-x-1.5 rounded-[3.5px]">
									<FileUp size={17} strokeWidth={2} />
									<span>Import</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</Dialog>
					{/* Dialog Create Project */}
				</div>
			</div>

			<div className="mt-2">
				<div className="h-[140px] rounded-2xl bg-stone-300"></div>
			</div>
		</div>
	);
}
