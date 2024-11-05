import { LifeCycleStages } from '@/@types/lifeCycleStages.type';
import { updateSVGAttributes } from '@/utils/utils';
import DOMPurify from 'dompurify';

type Props = {
	data: LifeCycleStages;
};

export default function CustomSuccessSooner({ data }: Props) {
	return (
		<div className="flex items-center space-x-3">
			{/* Icon */}
			<div className="h-fit w-fit rounded-sm bg-[#16a34a] p-2">
				<div
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(
							updateSVGAttributes({
								svgString: data.iconUrl,
								properties: { color: 'white', fill: 'white', height: 15, width: 15 },
							})
						),
					}}
				/>
			</div>
			{/* Description */}
			<div>
				<div className="">
					<b>{data.name}</b> create successfull
				</div>
				<div className="text-xs text-gray-600">{new Date().toDateString()}</div>
			</div>
		</div>
	);
}
