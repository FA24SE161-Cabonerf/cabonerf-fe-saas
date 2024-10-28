import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useEffect, useState } from 'react';
import { SVGIcon } from '@/utils/SVGIcon';
import { ImpactCategory } from '@/@types/impactCategory.type';
import _ from 'lodash';
type ComboBoxData = {
	id: string;
	value: string;
	label: string;
	iconUrl: string;
	midPointName: string;
	abbr: string;
	[key: string]: unknown;
};

type Props = {
	data: ComboBoxData[];
	title?: string;
	onSelected: (payload: ImpactCategory) => void;
	isLoading?: boolean;
	selectedId: ImpactCategory | ComboBoxData;
};

export function ImpactCategoriesComboBox({ data, onSelected, title, isLoading = true, selectedId }: Props) {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');

	useEffect(() => {
		if (selectedId) {
			const selectedItem = data.find((item) => item.id === selectedId.id);
			if (selectedItem) setValue(selectedItem.value);
		}
	}, [selectedId, data]);

	return (
		<React.Fragment>
			{isLoading ? (
				<Skeleton className="h-[35px] w-[270px]" />
			) : (
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button variant="outline" role="combobox" aria-expanded={open} className="w-[270px] justify-between font-normal">
							{value ? data.find((item) => item.value === value)?.label : title}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="min-w-[430px] p-0">
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
												onSelected(_.omit(item, ['value', 'label', 'midPointName']) as ImpactCategory);
												setValue(currentValue === value ? '' : currentValue);
												setOpen(false);
											}}
											className="flex justify-between"
										>
											<div className="flex items-center space-x-3">
												<SVGIcon url={item.iconUrl} />
												<div className="flex flex-col">
													<span className="text-sm font-medium">{item.label}</span>
													<span className="text-xs text-gray-500">
														{item.midPointName} ({item.abbr})
													</span>
												</div>
											</div>
											<Check className={cn('h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
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
