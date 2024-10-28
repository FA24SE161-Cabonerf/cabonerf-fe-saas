import { AppContext } from '@/contexts/app.context';
import { SVGIcon } from '@/utils/SVGIcon';
import clsx from 'clsx';
import { MapPin } from 'lucide-react';
import { useContext, useMemo } from 'react';

export default function PreviewProject() {
	const {
		app: { previewProject, impactCategory },
	} = useContext(AppContext);

	const value = useMemo(() => {
		const finded = previewProject?.impacts.find((item) => item.impactCategory.id === impactCategory?.id);
		return finded ? finded.value : 0;
	}, [previewProject?.impacts, impactCategory?.id]);

	return (
		<div
			className={clsx(`h-full w-0 overflow-hidden transition-all duration-500`, {
				'w-[750px]': previewProject !== undefined,
			})}
		>
			<div className="relative h-full border-l">
				<div className="px-3 py-2">
					<div className="min-h-[180px] rounded-3xl bg-primary-green">
						<div className="flex flex-col space-y-2 p-4">
							<span className="text-2xl font-semibold text-white">{previewProject?.name}</span>
							<div className="flex items-center space-x-1 text-white">
								{impactCategory?.iconUrl && <SVGIcon url={impactCategory.iconUrl} />}
								<span className="font-medium">{value}</span>
								<span>{impactCategory?.midpointImpactCategory?.unit?.name || ''}</span>
							</div>
							<div className="flex items-center space-x-1 text-white">
								<MapPin size={18} color="white" strokeWidth={2} />
								<span>{previewProject?.location}</span>
							</div>
						</div>
					</div>

					<div className="mt-3">
						<div className="flex justify-between">
							<div className="w-[75%] text-left text-base font-medium">Impact category</div>
							<div className="w-[25%] text-right text-base font-medium">Unit value</div>
						</div>

						<div className="mt-3 space-y-1 overflow-y-auto pb-2" style={{ maxHeight: '440px' }}>
							{previewProject?.impacts.map((item) => (
								<div key={item.id} className="flex w-full items-center gap-1 px-2">
									<div className="flex w-[75%] items-center space-x-3">
										<SVGIcon url={item.impactCategory.iconUrl} />
										<div className="flex flex-col">
											<span className="text-sm font-medium">{item.impactCategory.name}</span>
											<span className="text-xs text-gray-500">
												{item.impactCategory.midpointImpactCategory.name} ({item.impactCategory.midpointImpactCategory.abbr})
											</span>
										</div>
									</div>
									<div className="flex w-[25%] items-center space-x-2">
										<div className="text-sm font-medium">{item.value}</div>
										<div className="text-xs font-normal">{item.impactCategory.midpointImpactCategory.unit.name}</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
