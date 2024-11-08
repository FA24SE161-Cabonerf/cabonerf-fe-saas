import { CabonerfNodeData } from '@/@types/cabonerfNode.type';
import { ContextDispatch } from '@/@types/dispatch.type';
import { createContext, Dispatch, useReducer } from 'react';

interface ContextMenuSelector {
	process: CabonerfNodeData & { id: string };
	clientX: number;
	clientY: number;
}

type State = {
	contextMenuSelector: ContextMenuSelector | null;
	isOpen: boolean;
};

type Action =
	| {
			type: ContextDispatch.SET_CONTEXT_MENU;
			payload: ContextMenuSelector;
	  }
	| {
			type: ContextDispatch.CLEAR_CONTEXT_MENU;
	  }
	| {
			type: ContextDispatch.CLOSE_CONTEXT_MENU;
	  };

type ContextMenu = {
	app: State;
	dispatch: Dispatch<Action>;
};

const initialContext: ContextMenu = {
	app: {
		contextMenuSelector: null,
		isOpen: false,
	},
	dispatch: () => {},
};

// eslint-disable-next-line react-refresh/only-export-components
export const contextMenu = createContext<ContextMenu>(initialContext);

const reducer = (state: State, action: Action) => {
	switch (action.type) {
		case ContextDispatch.SET_CONTEXT_MENU:
			return { ...state, contextMenuSelector: action.payload, isOpen: true };
		case ContextDispatch.CLOSE_CONTEXT_MENU:
			return { ...state, isOpen: false };
		case ContextDispatch.CLEAR_CONTEXT_MENU:
			return { ...state, contextMenuSelector: null };
		default:
			return state;
	}
};

type Props = {
	children: React.ReactNode;
};
export default function ContextMenuProvider({ children }: Props) {
	const [app, dispatch] = useReducer(reducer, {
		contextMenuSelector: initialContext.app.contextMenuSelector,
		isOpen: initialContext.app.isOpen,
	});
	return <contextMenu.Provider value={{ app, dispatch }}>{children}</contextMenu.Provider>;
}
