import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { SheetBarDispatch } from '@/@types/dispatch.type';
import { Unit } from '@/@types/exchange.type';
import { createContext, Dispatch, useMemo, useReducer } from 'react';

interface QueryParams {
	pageSize?: number;
	pageCurrent?: number;
	methodId?: string;
	input?: string;
	keyword?: string;
	impactCategoryId?: string;
	emissionCompartmentId?: string;
}

type State = {
	process: (CabonerfNodeData & { id: string }) | undefined;
	queryParams: QueryParams;
	exchanges: {
		id: string;
		unit?: Unit;
		initUnit?: Unit;
		value?: number;
		initialValue?: number;
		isUpdate?: boolean;
	}[];
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

type SetExchange = {
	type: SheetBarDispatch.SET_EXCHANGE;
	payload: {
		id: string;
		unit?: Unit;
		initUnit?: Unit;
		value?: number;
		initialValue?: number;
		isUpdate?: boolean;
	};
};

type Action = SetNode | RemoveNode | ModifyQueryParams | SetExchange;

type SheetbarContext = {
	sheetState: State;
	sheetDispatch: Dispatch<Action>;
};

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case SheetBarDispatch.SET_NODE:
			return { ...state, process: action.payload };

		case SheetBarDispatch.REMOVE_NODE:
			return { ...state, process: undefined };

		case SheetBarDispatch.MODIFY_QUERY_PARAMS:
			return { ...state, queryParams: { ...state.queryParams, ...action.payload } };

		case SheetBarDispatch.SET_EXCHANGE: {
			const existedExchange = state.exchanges.find((item) => item.id === action.payload.id);

			if (existedExchange) {
				const initUnit = existedExchange.initUnit?.id;
				const changingUnit = action.payload.unit?.id || existedExchange.unit?.id;

				const initValue = action.payload.initialValue ?? existedExchange.initialValue;
				const changeValue = action.payload.value !== undefined ? action.payload.value : existedExchange.value;

				// Check if there is an actual change in unit or value
				const isUpdateByUnitChange = initUnit !== changingUnit;
				const isUpdateByValue = initValue !== changeValue;

				// Only apply updates if there is a detected change
				const updatedExchange = {
					...existedExchange,
					...action.payload,
					isUpdate: isUpdateByUnitChange || isUpdateByValue,
					value: changeValue, // Ensure `value` is updated to `changeValue`
				};

				return {
					...state,
					exchanges: state.exchanges.map((item) => (item.id === action.payload.id ? updatedExchange : item)),
				};
			}

			// Add new `action.payload` if `existedExchange` not found
			return {
				...state,
				exchanges: [...state.exchanges, action.payload],
			};
		}
		default:
			return state;
	}
};

const initialContext: SheetbarContext = {
	sheetState: {
		process: undefined,
		queryParams: {
			input: undefined,
			methodId: undefined,
			emissionCompartmentId: undefined,
			impactCategoryId: undefined,
			keyword: undefined,
			pageCurrent: undefined,
			pageSize: undefined,
		},
		exchanges: [],
	},
	sheetDispatch: () => {},
};

export const SheetbarContext = createContext<SheetbarContext>(initialContext);

type Props = {
	children: React.ReactNode;
};

export default function Sheetbar({ children }: Props) {
	const [sheetState, sheetDispatch] = useReducer(reducer, initialContext.sheetState);

	const data = useMemo(() => ({ sheetDispatch, sheetState }), [sheetState, sheetDispatch]);

	return <SheetbarContext.Provider value={data}>{children}</SheetbarContext.Provider>;
}
