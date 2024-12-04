import { LifeCycleStageBreakdown } from '@/@types/project.type';
import ContributionLifeStage from '@/common/icons/ContributionLifeStage';
import { PlaygroundContext } from '@/pages/Playground/contexts/playground.context';
import { formatPercentage2, updateSVGAttributes } from '@/utils/utils';
import { Info } from 'lucide-react';
import { useContext, useMemo } from 'react';

type Props = {
	lifeCycleStageBreakdown: LifeCycleStageBreakdown[];
};

export default function ContributionLifeStageView({ lifeCycleStageBreakdown }: Props) {
	const {
		playgroundState: { impactCategory },
	} = useContext(PlaygroundContext);

	const contributionLifeStageData = useMemo(() => {
		const data = lifeCycleStageBreakdown.find((item) => item.id === impactCategory?.id);

		if (data) {
			return {
				...data,
				lifeCycleStage: data?.lifeCycleStage.map((item) => ({
					...item,
					percent: item.percent * 100,
				})),
			};
		}
	}, [impactCategory?.id, lifeCycleStageBreakdown]);

	return (
		<div>
			<div className="sticky left-0 right-0 top-0 flex items-center justify-between border-[0.5px] border-b bg-white px-4 py-3">
				<div className="flex items-center space-x-2">
					<ContributionLifeStage one="#fca5a5" two="#f87171" three="#f87171" />
					<span className="text-base font-semibold">Contribution Life Cycle Stage Result</span>
					<Info size={17} fill="#aeaeae" color="#fff" />
				</div>
				<button className="cursor-pointer rounded px-2 py-1.5 duration-200 hover:bg-gray-100">
					<div className="h-[3px] w-[15px] rounded-full bg-black" />
				</button>
			</div>
			<div className="w-[500px] space-y-3 p-3">
				{Boolean(contributionLifeStageData) &&
					contributionLifeStageData?.lifeCycleStage.map((item) => (
						<div key={item.id} className="flex w-full items-center gap-2">
							<div className="relative h-[40px] w-[90%] overflow-hidden rounded-md outline-dashed outline-[1px] outline-gray-200">
								<div className="absolute left-3 top-1/2 z-20 flex -translate-y-1/2 items-center space-x-2 text-sm font-medium">
									<div
										dangerouslySetInnerHTML={{
											__html: updateSVGAttributes({
												svgString: item.iconUrl,
												properties: { height: 18, width: 18, fill: 'black', color: 'black' },
											}),
										}}
									/>
									<span className="text-[black]">{item.name}</span>
								</div>
								<div
									style={{ height: '100%', width: `${item.percent}%` }}
									className="z-10 rounded-md bg-[#4ade80] transition-all duration-500 ease-in-out"
								></div>
							</div>
							<div className="group relative w-[10%] text-right text-[13px] font-semibold">
								<span>{formatPercentage2(item.percent, 0)}</span>
								<div className="invisible absolute -top-5 right-0 rounded bg-black px-1 text-[11px] text-white group-hover:visible">
									{item.percent}
								</div>
							</div>
						</div>
					))}
			</div>
		</div>
	);
}
