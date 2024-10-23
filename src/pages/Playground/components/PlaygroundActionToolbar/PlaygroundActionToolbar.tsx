import ImpactAssessmentMethodApi from '@/apis/impact.api';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandInput, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { CommandItem } from 'cmdk';
import { CheckIcon } from 'lucide-react';
import React, { useState } from 'react';

function PlaygroundActionToolbar() {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>('');

	const data = useQuery({
		queryKey: ['impact_assessment_method'],
		queryFn: ImpactAssessmentMethodApi.prototype.getListImpactAssessmentMethod,
	});

	const impactMethodData = data.data?.data.data;
	if (!impactMethodData) return null;

	console.log('PlaygroundActionToolbar');

	return (
		<div className="bg-white">
			<div className="flex items-center">
				{/* Method  */}
				<div>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
								className="w-[300px] justify-between rounded-sm font-medium"
							>
								{value
									? impactMethodData.find(
											({ name, version, perspective: { abbr } }) =>
												`${name} , ${version} (${abbr})` === value
										) && value
									: 'Choose impact assessment method'}
								<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-[300px] rounded-sm p-0">
							<Command>
								<CommandInput placeholder="Search impact method..." className="h-9" />
								<CommandList className="pb-1">
									<p className="px-3 py-2 text-xs text-gray-400">List of methods supported by us</p>
									<CommandEmpty>No impact method found.</CommandEmpty>
									{impactMethodData.map(({ id, name, version, perspective: { abbr } }) => {
										const renderValue = `${name} , ${version} (${abbr})`;
										return (
											<CommandItem
												key={id}
												value={renderValue}
												onSelect={(currentValue) => {
													setValue(currentValue === value ? '' : currentValue);
													setOpen(false);
												}}
												className="mx-1 flex justify-between rounded-[4px] px-2 py-1 hover:bg-gray-100"
											>
												<div className="text-sm">{renderValue}</div>
												<CheckIcon
													className={cn(
														'ml-auto h-4 w-4',
														renderValue === value ? 'opacity-100' : 'opacity-0'
													)}
												/>
											</CommandItem>
										);
									})}
								</CommandList>
							</Command>
						</PopoverContent>
					</Popover>
				</div>
				{/* Category of method */}
			</div>
		</div>
	);
}

export default React.memo(PlaygroundActionToolbar);
