import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

type ComboBoxData = {
	id: string;
	value: string;
	label: string;
	[key: string]: string;
};

type Props = {
	data: ComboBoxData[];
	title?: string;
	onSelected: (id: string) => void;
	isLoading?: boolean;
	selectedId?: string;
	isRounded?: boolean;
};

function ImpactMethodComboBox({ data, onSelected, title, isLoading = true, isRounded = false, selectedId }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		if (selectedId) {
			const selectedItem = data.find((item) => item.id === selectedId);
			if (selectedItem) setValue(selectedItem.value);
		}
	}, [selectedId, data]);

	return (
		<React.Fragment>
			{isLoading ? (
				<Skeleton className="h-[35px] w-[180px]" />
			) : (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className={clsx(`flex min-w-[230px] items-center justify-between space-x-2 px-2 font-normal shadow-none`, {
								'justify-start border-none text-xs font-bold text-[#888888] hover:text-[#333333]': isRounded,
							})}
						>
							{isRounded && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									width={18}
									height={18}
									color="currentColor"
									fill="currentColor"
								>
									<path
										d="M15.5 6.5C15.5 8.433 13.933 10 12 10C10.067 10 8.5 8.433 8.5 6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M22 17.5C22 19.433 20.433 21 18.5 21C16.567 21 15 19.433 15 17.5C15 15.567 16.567 14 18.5 14C20.433 14 22 15.567 22 17.5Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
									<path
										d="M9 17.5C9 19.433 7.433 21 5.5 21C3.567 21 2 19.433 2 17.5C2 15.567 3.567 14 5.5 14C7.433 14 9 15.567 9 17.5Z"
										stroke="currentColor"
										strokeWidth="1.5"
									/>
								</svg>
							)}
							<span>{value ? data.find((item) => item.value === value)?.label : title}</span>
							{!isRounded && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="ml-2 p-0">
						<Command>
							<CommandInput placeholder="Search method..." />
							<CommandList>
								<CommandEmpty>No framework found.</CommandEmpty>
								<CommandGroup>
									{data.map((item) => (
										<CommandItem
											key={item.id}
											value={item.value}
											onSelect={(currentValue) => {
												onSelected(item.id);
												setValue(currentValue);
												setOpen(false);
											}}
										>
											<Check className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
											{item.label}
										</CommandItem>
									))}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			)}
		</React.Fragment>
	);
}

export default React.memo(ImpactMethodComboBox);
