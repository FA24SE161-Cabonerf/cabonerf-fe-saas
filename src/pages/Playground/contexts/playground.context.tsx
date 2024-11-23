import { PlaygroundDispatch } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

interface SetImpactMethod {
	type: PlaygroundDispatch.SET_IMPACT_METHOD;
	payload: string;
}

interface SetImpactCategory {
	type: PlaygroundDispatch.SET_IMPACT_CATEGORY;
	payload: ImpactCategory;
}

interface SetProjectInformation {
	type: PlaygroundDispatch.SET_PROJECT_INFOR;
	payload: {
		name: string;
		description: string;
		location: string;
	};
}

type Action = SetImpactMethod | SetImpactCategory | SetProjectInformation;

interface State {
	impactMethod: string | undefined;
	impactCategory: ImpactCategory | undefined;
	projectInformation:
		| {
				name: string;
				description: string;
				location: string;
		  }
		| undefined;
}

interface PlaygroundContext {
	playgroundState: State;
	playgroundDispatch: Dispatch<Action>;
}

const initialContext: PlaygroundContext = {
	playgroundState: {
		impactMethod: undefined,
		impactCategory: undefined,
		projectInformation: undefined,
	},
	playgroundDispatch: () => {},
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case PlaygroundDispatch.SET_IMPACT_METHOD:
			return { ...state, impactMethod: action.payload };
		case PlaygroundDispatch.SET_IMPACT_CATEGORY:
			return { ...state, impactCategory: action.payload };
		case PlaygroundDispatch.SET_PROJECT_INFOR:
			return { ...state, projectInformation: action.payload };
		default:
			return state;
	}
};

const PlaygroundContext = createContext<PlaygroundContext>(initialContext);

type Props = {
	children: React.ReactNode;
};

export const PlaygroundProvider = ({ children }: Props) => {
	const [playgroundState, playgroundDispatch] = useReducer(reducer, {
		impactMethod: initialContext.playgroundState.impactMethod,
		impactCategory: initialContext.playgroundState.impactCategory,
		projectInformation: initialContext.playgroundState.projectInformation,
	});

	const state = useMemo(() => {
		return { playgroundState, playgroundDispatch };
	}, [playgroundState, playgroundDispatch]);

	return <PlaygroundContext.Provider value={state}>{children}</PlaygroundContext.Provider>;
};

export { PlaygroundContext };
