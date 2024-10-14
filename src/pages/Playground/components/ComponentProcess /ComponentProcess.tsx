import { ChevronRight } from 'lucide-react';
import React from 'react';

type Props = {
	name: string;
	description: string;
	logo: React.ReactNode;
	color: string;
};

export default function ComponentProcess({ description, logo, name, color }: Props) {
	return (
		<div
			draggable
			className="box-border w-full rounded-md border border-transparent duration-150 hover:border-gray-300"
		>
			<div className="flex items-center justify-between">
				<div className="flex items-center">
					<div
						style={{ backgroundColor: color }}
						className="m-3 flex aspect-square size-[45px] items-center justify-center rounded-sm"
					>
						{logo}
					</div>
					<div className="max-w-[220px]">
						<h3 className="font-medium">{name}</h3>
						<p className="text-xs text-gray-500">{description}</p>
					</div>
				</div>
				<ChevronRight className="mr-1" strokeWidth={1.5} size={20} />
			</div>
		</div>
	);
}
