import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

interface QueryParams {
	pageSize?: number | undefined;
	pageCurrent?: number | undefined;
	methodId?: string | undefined;
	input?: string | undefined;
	keyword?: string | undefined;
	impactCategoryId?: string | undefined;
	emissionCompartmentId?: string | undefined;
}

type State = {
	process: (CabonerfNodeData & { id: string }) | null;
	queryParams: QueryParams;
};

type SetNode = {
	type: SheetBarDispatch.SET_NODE;
	payload: CabonerfNodeData & { id: string };
};

type RemoveNode = {
	type: SheetBarDispatch.REMOVE_NODE;
};

type ModifyQueryParams = {
	type: SheetBarDispatch.MODIFY_QUERY_PARAMS;
	payload: QueryParams;
};

type Action = SetNode | RemoveNode | ModifyQueryParams;

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

		case SheetBarDispatch.MODIFY_QUERY_PARAMS:
			return { ...state, queryParams: { ...state.queryParams, ...action.payload } };

		default:
			return state;
	}
};

const initialContext: SheetbarContext = {
	sheetState: {
		process: null,
		queryParams: {
			input: undefined,
			methodId: undefined,
			emissionCompartmentId: undefined,
			impactCategoryId: undefined,
			keyword: undefined,
			pageCurrent: undefined,
			pageSize: undefined,
		},
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
		queryParams: initialContext.sheetState.queryParams,
	});

	const data = useMemo(() => {
		return { sheetDispatch, sheetState };
	}, [sheetState, sheetDispatch]);

	return <SheetbarContext.Provider value={data}>{children}</SheetbarContext.Provider>;
}
