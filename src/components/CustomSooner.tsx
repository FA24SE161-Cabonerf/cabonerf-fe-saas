import { LifeCycleStages } from '@/@types/lifeCycleStage.type';
import { updateSVGAttributes } from '@/utils/utils';
import DOMPurify from 'dompurify';

type Props = {
	data: LifeCycleStages;
};

export default function CustomSuccessSooner({ data }: Props) {
	return (
		<div className="flex items-center space-x-3">
			{/* Icon */}
			<div className="h-fit w-[fit] rounded-xl bg-[#22c55e] p-2 shadow-md shadow-[#edf7ef]">
				<div
					dangerouslySetInnerHTML={{
						__html: DOMPurify.sanitize(
							updateSVGAttributes({
								svgString: data.iconUrl,
								properties: { color: 'white', fill: 'white', height: 18, width: 18 },
							})
						),
					}}
				/>
			</div>
			{/* Description */}
			<div>
				<div className="font-medium">{data.name} create successfull</div>
			</div>
		</div>
	);
}
