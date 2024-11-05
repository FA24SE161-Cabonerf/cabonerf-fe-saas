import { eDispatchType } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { GetProjectListResponse } from '@/@types/project.type';
import { User } from '@/@types/user.type';
import { getTokenFromLocalStorage, getUserProfileFromLocalStorage, TOKEN_KEY_NAME } from '@/utils/local_storage';
import React, { createContext, Dispatch, useReducer } from 'react';

type Props = {
	children: React.ReactNode;
};

type State = {
	isAuthenticated: boolean;
	userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	previewProject: GetProjectListResponse | undefined;
	deleteIds: string[];
	impactCategory: ImpactCategory | undefined;
	deleteProcessesIds: string[];
};

type LoginAction = {
	type: eDispatchType.LOGIN;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	};
};

type RegisterAction = {
	type: eDispatchType.REGISTER;
	payload: {
		isAuthenticated: boolean;
		userProfile: Omit<User, 'phone' | 'bio' | 'address'> | null;
	};
};

type LogoutAction = {
	type: eDispatchType.LOGOUT;
};

type AddProjectPreview = {
	type: eDispatchType.ADD_PROJECT_PREVIEW;
	payload: GetProjectListResponse;
};

type ClearProjectPreview = {
	type: eDispatchType.CLEAR_PROJECT_PREVIEW;
};

type AddDeleteIds = {
	type: eDispatchType.ADD_DELETE_IDS;
	payload: string;
};

type ClearDeleteIds = {
	type: eDispatchType.CLEAR_DELETE_IDS;
};

type SetImpactCategory = {
	type: eDispatchType.SET_IMPACT_CATEGORY;
	payload: ImpactCategory;
};

type AddDeleteProcessesIds = {
	type: eDispatchType.ADD_DELETE_PROCESSES_IDS;
	payload: string;
};

type ClearDeleteProcessesIds = {
	type: eDispatchType.CLEAR_DELETE_PROCESSES_IDS;
	payload: string;
};

type Action =
	| LoginAction
	| RegisterAction
	| LogoutAction
	| AddProjectPreview
	| ClearProjectPreview
	| AddDeleteIds
	| ClearDeleteIds
	| SetImpactCategory
	| AddDeleteProcessesIds
	| ClearDeleteProcessesIds;

type AppContext = {
	app: State;
	dispatch: Dispatch<Action>;
};

const initialAppStateContext: AppContext = {
	app: {
		isAuthenticated: Boolean(getTokenFromLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN)),
		userProfile: getUserProfileFromLocalStorage(),
		previewProject: undefined,
		deleteIds: [],
		impactCategory: undefined,
		deleteProcessesIds: [],
	},
	dispatch: () => {},
};

export const AppContext = createContext<AppContext>(initialAppStateContext);

const reducer = (state: State, action: Action) => {
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

		case eDispatchType.ADD_DELETE_IDS:
			return {
				...state,
				deleteIds: [...state.deleteIds, action.payload],
			};

		case eDispatchType.CLEAR_DELETE_IDS:
			return {
				...state,
				deleteIds: [],
			};

		case eDispatchType.SET_IMPACT_CATEGORY:
			return {
				...state,
				impactCategory: action.payload,
			};

		case eDispatchType.ADD_DELETE_PROCESSES_IDS:
			return {
				...state,
				deleteProcessesIds: [...state.deleteProcessesIds, action.payload],
			};

		case eDispatchType.CLEAR_DELETE_PROCESSES_IDS: {
			const filtered = state.deleteProcessesIds.filter((item) => item !== action.payload);
			return {
				...state,
				deleteProcessesIds: filtered,
			};
		}

		default:
			return state;
	}
};

export default function AppProvider({ children }: Props) {
	const [app, dispatch] = useReducer(reducer, {
		isAuthenticated: initialAppStateContext.app.isAuthenticated,
		userProfile: initialAppStateContext.app.userProfile,
		previewProject: initialAppStateContext.app.previewProject,
		deleteIds: initialAppStateContext.app.deleteIds,
		impactCategory: initialAppStateContext.app.impactCategory,
		deleteProcessesIds: initialAppStateContext.app.deleteProcessesIds,
	});

	return <AppContext.Provider value={{ app, dispatch }}>{children}</AppContext.Provider>;
}
