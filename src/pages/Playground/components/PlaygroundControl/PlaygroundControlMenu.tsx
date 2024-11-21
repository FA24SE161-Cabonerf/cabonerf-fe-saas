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
	const { playgroundControlState } = useContext(PlaygroundControlContext);

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
			<div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full rounded-[15px] shadow">
				<div className="h-full w-full overflow-hidden rounded-[15px] border-[0.5px] bg-white">{renderMenuContent()}</div>
			</div>
		)
	);
}
