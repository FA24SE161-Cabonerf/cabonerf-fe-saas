import { PlaygroundControlDispatch } from '@/@types/dispatch.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

type State = {
	selectedTriggerId: string | null;
	isMinimizeMenu: boolean;
	triggerIds: string[];
};

type Action =
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

		default:
			return state;
	}
};

export default function PlaygroundControlContextProvider({ children }: Props) {
	const [state, dispatch] = useReducer(reducer, {
		selectedTriggerId: initialPlaygroundControlContext.playgroundControlState.selectedTriggerId,
		triggerIds: initialPlaygroundControlContext.playgroundControlState.triggerIds,
		isMinimizeMenu: initialPlaygroundControlContext.playgroundControlState.isMinimizeMenu,
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
