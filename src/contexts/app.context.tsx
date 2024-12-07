import { eDispatchType } from '@/@types/dispatch.type';
import { ImpactCategory } from '@/@types/impactCategory.type';
import { GetProjectListResponse } from '@/@types/project.type';
import { User } from '@/@types/user.type';
import {
	getCurrentOrganizationFromLocalStorage,
	getTokenFromLocalStorage,
	getUserProfileFromLocalStorage,
	TOKEN_KEY_NAME,
} from '@/utils/local_storage';
import React, { createContext, Dispatch, useMemo, useReducer } from 'react';

type Props = {
	children: React.ReactNode;
};

type State = {
	isAuthenticated: boolean;
	userProfile: User | null;
	previewProject: GetProjectListResponse | undefined;
	impactCategory: ImpactCategory | undefined;
	selectCheckbox: string[];
	deleteProcessesIds: string[];
	currentOrganization: { orgId: string; orgName: string } | null;
};

type LoginAction = {
	type: eDispatchType.LOGIN;
	payload: {
		isAuthenticated: boolean;
		userProfile: User | null;
	};
};

type SelectCheckbox = {
	type: eDispatchType.SELECT_CHECKBOX;
	payload: string;
};

type RegisterAction = {
	type: eDispatchType.REGISTER;
	payload: {
		isAuthenticated: boolean;
		userProfile: User | null;
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

type UpdateProfile = {
	type: eDispatchType.UPDATE_PROFILE;
	payload: User;
};

type ClearCheckbox = {
	type: eDispatchType.CLEAR_SELECT_CHECKBOX;
};

type SelectAllCheckbox = {
	type: eDispatchType.SELECT_ALL_CHECKBOX;
	payload: {
		totalLength: number;
		projectIds: string[];
	};
};

type CloseCheckbox = {
	type: eDispatchType.CLOSE_CHECKBOX;
};

type UpdateOrganizationId = {
	type: eDispatchType.UPDATE_ORGANIZATION_ID;
	payload: {
		orgId: string;
		orgName: string;
	};
};

type Action =
	| LoginAction
	| RegisterAction
	| LogoutAction
	| AddProjectPreview
	| ClearProjectPreview
	| SetImpactCategory
	| AddDeleteProcessesIds
	| ClearDeleteProcessesIds
	| UpdateProfile
	| SelectCheckbox
	| ClearCheckbox
	| SelectAllCheckbox
	| CloseCheckbox
	| UpdateOrganizationId;

type AppContext = {
	app: State;
	dispatch: Dispatch<Action>;
};

const initialAppStateContext: AppContext = {
	app: {
		isAuthenticated: Boolean(getTokenFromLocalStorage(TOKEN_KEY_NAME.ACCESS_TOKEN)),
		userProfile: getUserProfileFromLocalStorage(),
		previewProject: undefined,
		impactCategory: undefined,
		deleteProcessesIds: [],
		selectCheckbox: [],
		currentOrganization: getCurrentOrganizationFromLocalStorage(),
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

		case eDispatchType.SELECT_CHECKBOX: {
			const isExisted = state.selectCheckbox.includes(action.payload);

			return {
				...state,
				selectCheckbox: isExisted
					? state.selectCheckbox.filter((item) => item !== action.payload)
					: [...state.selectCheckbox, action.payload],
			};
		}

		case eDispatchType.CLEAR_SELECT_CHECKBOX:
			return { ...state, selectCheckbox: [] };

		case eDispatchType.SELECT_ALL_CHECKBOX: {
			const { totalLength, projectIds } = action.payload;

			if (!projectIds || projectIds.length === 0) {
				return state;
			}

			const areAllSelected = state.selectCheckbox.length === totalLength;

			return {
				...state,
				selectCheckbox: areAllSelected ? [] : [...projectIds],
			};
		}

		case eDispatchType.UPDATE_PROFILE:
			return { ...state, userProfile: action.payload };

		case eDispatchType.CLOSE_CHECKBOX:
			return { ...state, selectCheckbox: [] };

		case eDispatchType.UPDATE_ORGANIZATION_ID:
			return { ...state, currentOrganizationId: action.payload };

		default:
			return state;
	}
};

export default function AppProvider({ children }: Props) {
	const [app, dispatch] = useReducer(reducer, {
		isAuthenticated: initialAppStateContext.app.isAuthenticated,
		userProfile: initialAppStateContext.app.userProfile,
		previewProject: initialAppStateContext.app.previewProject,
		impactCategory: initialAppStateContext.app.impactCategory,
		deleteProcessesIds: initialAppStateContext.app.deleteProcessesIds,
		selectCheckbox: initialAppStateContext.app.selectCheckbox,
		currentOrganization: initialAppStateContext.app.currentOrganization,
	});

	const context = useMemo(() => {
		return { app, dispatch };
	}, [app, dispatch]);

	return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
}
