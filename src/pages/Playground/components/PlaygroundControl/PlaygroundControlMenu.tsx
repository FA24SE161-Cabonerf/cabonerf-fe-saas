import { PlaygroundControlDispatch } from '@/@types/dispatch.type';
import { Impact, Insensity } from '@/@types/project.type';
import ContributionBreakdownView from '@/pages/Playground/components/PlaygroundControl/ContributionBreakdownView';
import ImpactAssessmentView from '@/pages/Playground/components/PlaygroundControl/ImpactAssessmentView';
import { PlaygroundControlContext } from '@/pages/Playground/contexts/playground-control.context';
import { useContext } from 'react';

type TransformContributor = {
	processId: string;
	net?: number;
	total?: number;
	subProcesses: TransformContributor[];
};

type Props = {
	impacts: Impact[];
	contributionBreakdown?: TransformContributor;
	compareWorlds?: Insensity[];
};

export default function PlaygroundControlMenu({ impacts, contributionBreakdown }: Props) {
	const { playgroundControlState, playgroundControlDispatch } = useContext(PlaygroundControlContext);

	const handleTriggerMaximize = () => playgroundControlDispatch({ type: PlaygroundControlDispatch.TRIGGER_MINIMIZE });

	const renderMenuContent = () => {
		switch (playgroundControlState.selectedTriggerId) {
			case '1':
				return <ImpactAssessmentView impacts={impacts} />;
			case '2':
				return <ContributionBreakdownView data={contributionBreakdown as TransformContributor} />;
			default:
				break;
		}
	};

	return (
		playgroundControlState.selectedTriggerId && (
			<div className="absolute -top-1.5 left-1/2 -translate-x-1/2 -translate-y-full rounded-[15px] shadow">
				{playgroundControlState.isMinimizeMenu ? (
					<button
						onClick={handleTriggerMaximize}
						className="cursor-pointer rounded-md bg-white px-2 py-1 text-[13px] font-medium hover:bg-gray-50"
					>
						Result view
					</button>
				) : (
					<div className="h-full w-full overflow-hidden rounded-[15px] border-[0.5px] bg-white">{renderMenuContent()}</div>
				)}
			</div>
		)
	);
}
