import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ComponentProcess from '@/pages/Playground/components/ComponentProcess ';
import clsx from 'clsx';
import { Factory, Pickaxe, Pin, PinOff, Plus, Recycle, Search, SquarePlus, Truck, UserRoundCheck } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const dataLifeStage = [
	{
		id: '0',
		name: 'Blank Process',
		description: 'Custom your own process',
		logo: <SquarePlus strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
	{
		id: '1',
		name: 'Raw Materials',
		description: 'Resource extractions & transport to production facility gate',
		logo: <Pickaxe strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
	{
		id: '2',
		name: 'Production',
		description: 'From input material to output products of production facility',
		logo: <Factory strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
	{
		id: '3',
		name: 'Distribute',
		description: 'From the production facility gate to consumer possession',
		logo: <Truck strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
	{
		id: '4',
		name: 'Use',
		description: 'From start to finish consumer possession and use',
		logo: <UserRoundCheck strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
	{
		id: '5',
		name: 'End-of-life',
		description: 'From consumer to recyling or returning to nature',
		logo: <Recycle strokeWidth={1.5} color="white" />,
		color: '#16a34a',
	},
];

export default function PlaygroundToolBox() {
	const [isShowToolbox, setIsShowToolBox] = useState<boolean>(true);
	const [isPinToolBox, setIsPinToolBox] = useState<boolean>(false);
	const toolboxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isShowToolbox) return;

		const handleCloseToolBox = (event: MouseEvent) => {
			if (isPinToolBox === false && toolboxRef.current && !toolboxRef.current.contains(event.target as Node)) {
				setIsShowToolBox(false);
			}
		};

		document.addEventListener('click', handleCloseToolBox);

		return () => {
			document.removeEventListener('click', handleCloseToolBox);
		};
	}, [isShowToolbox, isPinToolBox]);

	const toggleToolbox = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		setIsShowToolBox((prevState) => !prevState);
	};

	const pinToolbox = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		event.stopPropagation();
		setIsPinToolBox((prevState) => !prevState);
	};

	return (
		<div className="relative">
			<Button onClick={toggleToolbox} className="m-[15px] transform p-2.5 transition duration-200 hover:scale-110">
				<Plus size={20} strokeWidth={2.5} />
			</Button>

			<div
				ref={toolboxRef}
				className={clsx(
					`absolute left-0 top-0 h-auto min-w-[330px] transform rounded-br-md border-b border-r bg-white shadow-sm transition duration-300`,
					{
						'-translate-x-[calc(100%+15px)]': isShowToolbox !== true,
					}
				)}
			>
				{/* Header */}
				<div className="px-5 py-3">
					<div className="flex items-center justify-between">
						<h3 className="text-xl font-medium">Toolbox</h3>
						<button onClick={pinToolbox}>
							{isPinToolBox ? <PinOff strokeWidth={1.5} size={18} /> : <Pin strokeWidth={1.5} size={18} />}
						</button>
					</div>
					<p className="mt-2 text-sm text-gray-500">Click and drag a block to canvas to build a workflow</p>
				</div>

				<div className="my-3 mt-2 px-5">
					<div className="flex h-8 items-center space-x-2 rounded-md border px-3">
						<Search size={17} />
						<input
							type="text"
							className="w-full outline-none placeholder:text-sm placeholder:font-light"
							placeholder="Search process component..."
						/>
					</div>
				</div>
				<Separator />

				<div className="max-h-[700px] overflow-y-auto">
					{' '}
					{/* Add max-height and scroll */}
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1" className="rounded-br-md border-none">
							<AccordionTrigger className="border-b px-6 py-3 font-normal">LIFE CYCLE STAGES</AccordionTrigger>
							<AccordionContent className="bg-[#fafafa] px-3 py-3">
								{dataLifeStage.map((data) => (
									<ComponentProcess
										color={data.color}
										key={data.id}
										name={data.name}
										logo={data.logo}
										description={data.description}
									/>
								))}
							</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1" className="rounded-br-md border-none">
							<AccordionTrigger className="border-b px-6 py-3 font-normal">OBJECT LIBRARY</AccordionTrigger>
							<AccordionContent className="bg-[#fbfbfb] px-3 py-4">Updating</AccordionContent>
						</AccordionItem>
					</Accordion>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1" className="rounded-br-md border-b border-none">
							<AccordionTrigger className="px-6 font-normal">REFERENCES</AccordionTrigger>
							<AccordionContent className="rounded-br-md border-b-0 bg-[#fbfbfb] px-3 py-4">
								Updating
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>
		</div>
	);
}
