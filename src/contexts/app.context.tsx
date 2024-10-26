import { tDispatchType } from '@/@types/dispatch.type';
import { tImpactCategory, tMidPointImpactCategory, tProject } from '@/@types/project.type';
import { tUser } from '@/@types/user.type';
import { getTokenFromLocalStorage, getUserProfileFromLocalStorage, TOKEN_KEY_NAME } from '@/utils/local_storage';
import React, { createContext, Dispatch, useReducer } from 'react';

type tProps = {
	children: React.ReactNode;
};

type tState = {
	isAuthenticated: boolean;
	userProfile: Omit<tUser, 'phone' | 'bio' | 'address'> | null;
	previewProject: tProject | undefined;
	currentImpactCategoryFilter:
		| Omit<
				tImpactCategory<Omit<tMidPointImpactCategory, 'description'>>,
				'indicator' | 'indicatorDescription' | 'unit'
		  >
		| undefined;
};

type tLoginAction = {
	type: tDispatchType.LOGIN;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<tUser, 'phone' | 'bio' | 'address'> | null;
	};
};

type tRegisterAction = {
	type: tDispatchType.REGISTER;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<tUser, 'phone' | 'bio' | 'address'> | null;
	};
};

type tLogoutAction = {
	type: tDispatchType.LOGOUT;
};

type tAddProjectPreview = {
	type: tDispatchType.ADD_PROJECT_PREVIEW;
	payload: tProject;
};

type tClearProjectPreview = {
	type: tDispatchType.CLEAR_PROJECT_PREVIEW;
	payload: undefined;
};

type tAction = tLoginAction | tRegisterAction | tLogoutAction | tAddProjectPreview | tClearProjectPreview;

type tAppContext = {
	app: tState;
	dispatch: Dispatch<tAction>;
};

const initialAppStateContext: tAppContext = {
	app: {
		isAuthenticated: Boolean(getTokenFromLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN)),
		userProfile: getUserProfileFromLocalStorage(),
		previewProject: undefined,
		currentImpactCategoryFilter: undefined,
	},
	dispatch: () => {},
};

export const AppContext = createContext<tAppContext>(initialAppStateContext);

const reducer = (state: tState, action: tAction) => {
	const { type } = action;

	switch (type) {
		case tDispatchType.LOGIN:
			return {
				...state,
				isAuthenticated: action.payload.isAuthenticated,
				userProfile: action.payload.userProfile,
			};
		case tDispatchType.REGISTER:
			return {
				...state,
				isAuthenticated: action.payload.isAuthenticated,
				userProfile: action.payload.userProfile,
			};
		case tDispatchType.LOGOUT:
			return {
				...state,
				isAuthenticated: false,
				userProfile: null,
			};
		case tDispatchType.ADD_PROJECT_PREVIEW:
			return {
				...state,
				previewProject: action.payload,
			};
		case tDispatchType.CLEAR_PROJECT_PREVIEW:
			return {
				...state,
				previewProject: undefined,
			};
		default:
			return state;
	}
};

export default function AppProvider({ children }: tProps) {
	const [app, dispatch] = useReducer(reducer, {
		isAuthenticated: initialAppStateContext.app.isAuthenticated,
		userProfile: initialAppStateContext.app.userProfile,
		previewProject: initialAppStateContext.app.previewProject,
		currentImpactCategoryFilter: initialAppStateContext.app.currentImpactCategoryFilter,
	});

	return <AppContext.Provider value={{ app, dispatch }}>{children}</AppContext.Provider>;
}
