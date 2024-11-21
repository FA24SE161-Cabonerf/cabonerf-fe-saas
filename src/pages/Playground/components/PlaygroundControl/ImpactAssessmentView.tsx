import { Impact } from '@/@types/project.type';
import { updateSVGAttributes } from '@/utils/utils';
import DOMPurify from 'dompurify';

type Props = {
	impacts: Impact[];
};

export default function ImpactAssessmentView({ impacts }: Props) {
	return (
		<div className="">
			<div className="sticky left-0 right-0 top-0 border-b bg-white py-3 text-center text-sm font-medium">Impact Assessment Result</div>
			<div className="flex h-[400px] w-[670px] flex-col space-y-1 overflow-y-scroll px-2 py-1">
				{impacts.map((item) => (
					<div key={item.id} className="grid grid-cols-12 items-center gap-3 p-1">
						<div className="col-span-1 flex justify-center">
							<div
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(
										updateSVGAttributes({
											svgString: item.impactCategory.iconUrl,
											properties: {
												height: 25,
												width: 25,
												color: '#000',
												fill: 'none',
											},
										})
									),
								}}
							/>
						</div>
						<div className="col-span-8">
							<div className="text-base font-medium">{item.impactCategory.name}</div>
							<div className="text-xs text-gray-600">
								{item.impactCategory.midpointImpactCategory.name} ({item.impactCategory.midpointImpactCategory.abbr})
							</div>
						</div>
						<div className="col-span-3 flex items-center justify-end space-x-2 text-xs">
							<div className="text-sm font-semibold">{item.value}</div>
							<div className="font-medium">{item.impactCategory.midpointImpactCategory.unit.name}</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
