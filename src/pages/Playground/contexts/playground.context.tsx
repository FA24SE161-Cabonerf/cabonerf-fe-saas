import { PlaygroundDispatch } from '@/@types/dispatch.type';
import { ImpactMethod } from '@/@types/impactMethod.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

interface SetImpactMethod {
	type: PlaygroundDispatch.SET_IMPACT_METHOD;
	payload: ImpactMethod;
}

type Action = SetImpactMethod;

interface State {
	impactMethod: ImpactMethod | null;
}

interface PlaygroundContext {
	playgroundState: State;
	playgroundDispatch: Dispatch<Action>;
}

const initialContext: PlaygroundContext = {
	playgroundState: {
		impactMethod: null,
	},
	playgroundDispatch: () => {},
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case PlaygroundDispatch.SET_IMPACT_METHOD:
			return { ...state, impactMethod: action.payload };

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
	});

	const state = useMemo(() => {
		return { playgroundState };
	}, [playgroundState]);

	return <PlaygroundContext.Provider value={{ ...state, playgroundDispatch }}>{children}</PlaygroundContext.Provider>;
};

export { PlaygroundContext };
