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

type Action = SetImpactMethod | SetImpactCategory;

interface State {
	impactMethod: string | undefined;
	impactCategory: ImpactCategory | undefined;
}

interface PlaygroundContext {
	playgroundState: State;
	playgroundDispatch: Dispatch<Action>;
}

const initialContext: PlaygroundContext = {
	playgroundState: {
		impactMethod: undefined,
		impactCategory: undefined,
	},
	playgroundDispatch: () => {},
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case PlaygroundDispatch.SET_IMPACT_METHOD:
			return { ...state, impactMethod: action.payload };
		case PlaygroundDispatch.SET_IMPACT_CATEGORY:
			return { ...state, impactCategory: action.payload };
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
	});

	const state = useMemo(() => {
		return { playgroundState };
	}, [playgroundState]);

	return <PlaygroundContext.Provider value={{ ...state, playgroundDispatch }}>{children}</PlaygroundContext.Provider>;
};

export { PlaygroundContext };
