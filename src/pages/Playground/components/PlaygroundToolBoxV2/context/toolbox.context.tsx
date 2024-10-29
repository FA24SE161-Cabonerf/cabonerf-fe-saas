import { ToolboxDispatchType } from '@/@types/dispatch.type';
import React, { createContext, Dispatch, useReducer } from 'react';

/**
 * Implement
 */
type Props = {
	children: React.ReactNode;
};

type IdsMenu = {
	id: string;
	current: HTMLDivElement;
};

type State = {
	isLoading: boolean;
	isOpenMenu: boolean;
	idsTrigger: string[];
	idsMenu: IdsMenu[] | null;
	selectedTriggerId: string;
};

type Action =
	| {
			type: ToolboxDispatchType.LOADING_TOOLBOX;
			payload: boolean;
	  }
	| {
			type: ToolboxDispatchType.TRIGGER_MENU;
	  }
	| {
			type: ToolboxDispatchType.ADD_TRIGGER_ID;
			payload: string;
	  }
	| {
			type: ToolboxDispatchType.CLEAR_TRIGGER_IDS;
	  }
	| {
			type: ToolboxDispatchType.ADD_MENU_ID;
			payload: IdsMenu;
	  }
	| {
			type: ToolboxDispatchType.SELECTED_TRIGGER_ID;
			payload: string;
	  }
	| {
			type: ToolboxDispatchType.CLEAR_SELECTED_TRIGGER_ID;
	  };

type ToolboxContext = {
	app: State;
	dispatch: Dispatch<Action>;
};

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case ToolboxDispatchType.LOADING_TOOLBOX:
			return { ...state, isLoading: action.payload };
		case ToolboxDispatchType.TRIGGER_MENU:
			return { ...state, isOpenMenu: !state.isOpenMenu };

		case ToolboxDispatchType.ADD_TRIGGER_ID: {
			if (state.idsTrigger.includes(action.payload)) {
				console.error('Duplicated id of <ToolboxTrigger/>');
				return state;
			}
			return { ...state, idsTrigger: [...state.idsTrigger, action.payload] };
		}

		case ToolboxDispatchType.CLEAR_TRIGGER_IDS:
			return { ...state, idsTrigger: [], idsMenu: [] };

		case ToolboxDispatchType.ADD_MENU_ID: {
			const exists = state.idsMenu?.find((item) => item.id === action.payload.id);
			if (exists) {
				console.error('Duplicated id of <ToolboxMenu/>');
				return state;
			}
			return { ...state, idsMenu: [...(state.idsMenu ?? []), action.payload] };
		}

		case ToolboxDispatchType.SELECTED_TRIGGER_ID:
			return { ...state, selectedTriggerId: action.payload };

		case ToolboxDispatchType.CLEAR_SELECTED_TRIGGER_ID:
			return { ...state, selectedTriggerId: '' };

		default:
			return state;
	}
};

const initialToolboxContext: ToolboxContext = {
	app: {
		isLoading: false,
		isOpenMenu: false,
		idsTrigger: [],
		idsMenu: null,
		selectedTriggerId: '',
	},
	dispatch: () => {},
};

export const ToolboxContext: React.Context<ToolboxContext> = createContext<ToolboxContext>(initialToolboxContext);

export default function Toolbox({ children }: Props) {
	const [app, dispatch] = useReducer<typeof reducer>(reducer, {
		isLoading: initialToolboxContext.app.isLoading,
		isOpenMenu: initialToolboxContext.app.isOpenMenu,
		idsTrigger: initialToolboxContext.app.idsTrigger,
		idsMenu: initialToolboxContext.app.idsMenu,
		selectedTriggerId: initialToolboxContext.app.selectedTriggerId,
	});

	return <ToolboxContext.Provider value={{ app, dispatch }}>{children}</ToolboxContext.Provider>;
}
