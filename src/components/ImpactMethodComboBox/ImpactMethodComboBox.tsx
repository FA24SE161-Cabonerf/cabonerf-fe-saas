import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

type ComboBoxData = {
	id: string;
	value: string;
	label: string;
};

type Props = {
	data: ComboBoxData[];
	title?: string;
	onSelected: (id: string) => void;
	isLoading?: boolean;
	selectedId?: string;
};

export function ImpactMethodComboBox({ data, onSelected, title, isLoading = true, selectedId }: Props) {
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
						<Button variant="outline" role="combobox" aria-expanded={open} className="w-auto px-2 font-normal">
							{value ? data.find((item) => item.value === value)?.label : title}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="p-0">
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
												setValue(currentValue === value ? '' : currentValue);
												setOpen(false);
											}}
										>
											<Check
												className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')}
											/>
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
