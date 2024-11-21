import { Impact } from '@/@types/project.type';
import ImpactResult from '@/common/icons/ImpactResult';
import { updateSVGAttributes } from '@/utils/utils';
import DOMPurify from 'dompurify';
import { Info } from 'lucide-react';

type Props = {
	impacts: Impact[];
};

export default function ImpactAssessmentView({ impacts }: Props) {
	return (
		<div className="">
			<div className="sticky left-0 right-0 top-0 flex items-center space-x-2 bg-white p-4">
				<ImpactResult one="#0284c7" two="#075985" three="#0c4a6e" four="#0284c7" five="#0369a1" six="#0c4a6e" seven="#0c4a6e" />
				<span className="text-base font-semibold">Impact Assessment Result</span>
				<Info size={17} fill="#aeaeae" color="#fff" />
			</div>

			<div className="flex h-[400px] w-[670px] flex-col space-y-1 overflow-y-scroll px-2 py-2">
				{impacts.map((item) => (
					<div key={item.id} className="grid grid-cols-12 items-center gap-3 px-1 py-1.5">
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
