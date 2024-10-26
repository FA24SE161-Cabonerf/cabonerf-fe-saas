import { tDispatchType } from '@/@types/dispatch.type';
import { AppContext } from '@/contexts/app.context';
import { SVGIcon } from '@/utils/SVGIcon';
import clsx from 'clsx';
import { ListCollapse } from 'lucide-react';
import { useContext } from 'react';

export default function PreviewProject() {
	const { app, dispatch } = useContext(AppContext);

	const clearPreview = () => {
		dispatch({ type: tDispatchType.CLEAR_PROJECT_PREVIEW, payload: undefined });
	};

	return (
		<div
			className={clsx(`h-full w-0 transition-all duration-500`, {
				'w-[650px]': app.previewProject !== undefined,
			})}
		>
			<div className="relative h-full border-l">
				{app.previewProject !== undefined && (
					<button
						className="absolute -left-3 top-1/2 rounded-sm border border-gray-300 bg-white p-1 shadow hover:bg-gray-100"
						onClick={clearPreview}
					>
						<ListCollapse size={15} strokeWidth={1.5} />
					</button>
				)}

				<div className="px-3 py-2">
					<div className="h-[200px] rounded-3xl bg-primary-green">
						<div className="flex flex-col p-4">
							<span className="text-3xl font-semibold text-white">{app.previewProject?.name}</span>
							<div style={{ color: 'white' }}>
								<SVGIcon url={app.previewProject?.impacts[0].impactCategory.iconUrl as string} />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
