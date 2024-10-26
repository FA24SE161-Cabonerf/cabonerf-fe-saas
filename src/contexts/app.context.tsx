import { eDispatchType } from '@/@types/dispatch.type';
import { Project } from '@/@types/project.type';
import { User } from '@/@types/user.type';
import { getTokenFromLocalStorage, getUserProfileFromLocalStorage, TOKEN_KEY_NAME } from '@/utils/local_storage';
import React, { createContext, Dispatch, useReducer } from 'react';

type tProps = {
	children: React.ReactNode;
};

type tState = {
	isAuthenticated: boolean;
	userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	previewProject: Project | undefined;
};

type tLoginAction = {
	type: eDispatchType.LOGIN;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	};
};

type tRegisterAction = {
	type: eDispatchType.REGISTER;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	};
};

type tLogoutAction = {
	type: eDispatchType.LOGOUT;
};

type tAddProjectPreview = {
	type: eDispatchType.ADD_PROJECT_PREVIEW;
	payload: Project;
};

type tClearProjectPreview = {
	type: eDispatchType.CLEAR_PROJECT_PREVIEW;
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
	},
	dispatch: () => {},
};

export const AppContext = createContext<tAppContext>(initialAppStateContext);

const reducer = (state: tState, action: tAction) => {
	const { type } = action;

	switch (type) {
		case eDispatchType.LOGIN:
			return {
				...state,
				isAuthenticated: action.payload.isAuthenticated,
				userProfile: action.payload.userProfile,
			};
		case eDispatchType.REGISTER:
			return {
				...state,
				isAuthenticated: action.payload.isAuthenticated,
				userProfile: action.payload.userProfile,
			};
		case eDispatchType.LOGOUT:
			return {
				...state,
				isAuthenticated: false,
				userProfile: null,
			};
		case eDispatchType.ADD_PROJECT_PREVIEW:
			return {
				...state,
				previewProject: action.payload,
			};
		case eDispatchType.CLEAR_PROJECT_PREVIEW:
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
	});

	return <AppContext.Provider value={{ app, dispatch }}>{children}</AppContext.Provider>;
}
