import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { PlaygroundControlDispatch } from '@/@types/dispatch.type';
import { Contributor, Impact } from '@/@types/project.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

type State = {
	selectedTriggerId: string | null;
	isMinimizeMenu: boolean;
	triggerIds: string[];
	impacts: Impact[] | null;
	contributionBreakdown: Contributor | null;
	processes: CabonerfNodeData[] | null;
	edgeContributions: Contributor[];
};

type Action =
	| {
			type: PlaygroundControlDispatch.TRIGGER_MINIMIZE;
	  }
	| {
			type: PlaygroundControlDispatch.ADD_TRIGGER_ID;
			payload: string;
	  }
	| {
			type: PlaygroundControlDispatch.SELECTED_TRIGGER_ID;
			payload: string | null;
	  }
	| {
			type: PlaygroundControlDispatch.CLEAR_TRIGGER_IDS;
	  }
	| {
			type: PlaygroundControlDispatch.ADD_CALCULATED_DATA;
			payload: {
				contributionBreakdown: Contributor;
				impacts: Impact[];
				processes: CabonerfNodeData[];
			};
	  };

type PlaygroundControlContext = {
	playgroundControlState: State;
	playgroundControlDispatch: Dispatch<Action>;
};

const initialPlaygroundControlContext: PlaygroundControlContext = {
	playgroundControlState: {
		selectedTriggerId: null,
		isMinimizeMenu: false,
		triggerIds: [],
		contributionBreakdown: null,
		impacts: null,
		processes: [],
		edgeContributions: [],
	},
	playgroundControlDispatch: () => {},
};

export const PlaygroundControlContext = createContext<PlaygroundControlContext>(initialPlaygroundControlContext);

type Props = {
	children: React.ReactNode;
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case PlaygroundControlDispatch.ADD_TRIGGER_ID: {
			if (state.triggerIds.includes(action.payload)) {
				console.warn('Id already exist');
				return state;
			}
			return { ...state, triggerIds: [...state.triggerIds, action.payload] };
		}
		case PlaygroundControlDispatch.SELECTED_TRIGGER_ID:
			return { ...state, selectedTriggerId: action.payload };

		case PlaygroundControlDispatch.CLEAR_TRIGGER_IDS:
			return { ...state, selectedTriggerId: null };

		case PlaygroundControlDispatch.TRIGGER_MINIMIZE:
			return { ...state, isMinimizeMenu: !state.isMinimizeMenu };

		case PlaygroundControlDispatch.ADD_CALCULATED_DATA: {
			function flattenContributor(contributor: Contributor): Contributor[] {
				const result: Contributor[] = [];

				const traverse = (current: Contributor) => {
					result.push({ ...current, subProcesses: [] });

					current.subProcesses.forEach((sub) => traverse(sub));
				};

				traverse(contributor);

				return result;
			}

			return {
				...state,
				contributionBreakdown: action.payload.contributionBreakdown,
				impacts: action.payload.impacts,
				processes: action.payload.processes,
				edgeContributions: flattenContributor(action.payload.contributionBreakdown),
			};
		}

		default:
			return state;
	}
};

export default function PlaygroundControlContextProvider({ children }: Props) {
	const [state, dispatch] = useReducer(reducer, {
		selectedTriggerId: initialPlaygroundControlContext.playgroundControlState.selectedTriggerId,
		triggerIds: initialPlaygroundControlContext.playgroundControlState.triggerIds,
		isMinimizeMenu: initialPlaygroundControlContext.playgroundControlState.isMinimizeMenu,
		contributionBreakdown: initialPlaygroundControlContext.playgroundControlState.contributionBreakdown,
		impacts: initialPlaygroundControlContext.playgroundControlState.impacts,
		processes: initialPlaygroundControlContext.playgroundControlState.processes,
		edgeContributions: initialPlaygroundControlContext.playgroundControlState.edgeContributions,
	});

	const context = useMemo(
		() => ({
			playgroundControlState: state,
			playgroundControlDispatch: dispatch,
		}),
		[state, dispatch]
	);

	return <PlaygroundControlContext.Provider value={context}>{children}</PlaygroundControlContext.Provider>;
}
