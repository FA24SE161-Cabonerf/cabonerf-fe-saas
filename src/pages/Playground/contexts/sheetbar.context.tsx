import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

type State = {
	process: (CabonerfNodeData & { id: string }) | null;
};

type SetNode = {
	type: SheetBarDispatch.SET_NODE;
	payload: CabonerfNodeData & { id: string };
};
type RemoveNode = {
	type: SheetBarDispatch.REMOVE_NODE;
};

type Action = SetNode | RemoveNode;

type SheetbarContext = {
	sheetState: State;
	sheetDispatch: Dispatch<Action>;
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case SheetBarDispatch.SET_NODE:
			return { ...state, process: action.payload };

		case SheetBarDispatch.REMOVE_NODE:
			return { ...state, process: null };

		default:
			return state;
	}
};

const initialContext: SheetbarContext = {
	sheetState: {
		process: null,
	},
	sheetDispatch: () => {},
};

export const SheetbarContext = createContext<SheetbarContext>(initialContext);

type Props = {
	children: React.ReactNode;
};

export default function Sheetbar({ children }: Props) {
	const [sheetState, sheetDispatch] = useReducer(reducer, {
		process: initialContext.sheetState.process,
	});

	const data = useMemo(() => {
		return { sheetDispatch, sheetState };
	}, [sheetState, sheetDispatch]);

	return <SheetbarContext.Provider value={data}>{children}</SheetbarContext.Provider>;
}
