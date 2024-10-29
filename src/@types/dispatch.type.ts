export enum eDispatchType {
	LOGIN = 'LOGIN',
	REGISTER = 'REGISTER',
	LOGOUT = 'LOGOUT',
	ADD_PROJECT_PREVIEW = 'ADD_PROJECT_PREVIEW',
	CLEAR_PROJECT_PREVIEW = 'CLEAR_PROJECT_PREVIEW',
	ADD_IMPACT_ASSESSMENT_METHOD = 'ADD_IMPACT_ASSESSMENT_METHOD',
	ADD_DELETE_IDS = 'ADD_DELETE_IDS',
	CLEAR_DELETE_IDS = 'CLEAR_DELETE_IDS',
	SET_IMPACT_CATEGORY = 'SET_IMPACT_CATEGORY',
}

export enum ToolboxDispatchType {
	LOADING_TOOLBOX = 'LOADING_TOOLBOX',
	TRIGGER_MENU = 'TRIGGER_MENU',
	ADD_TRIGGER_ID = 'ADD_TRIGGER_ID',
	CLEAR_TRIGGER_IDS = 'CLEAR_TRIGGER_IDS',
	ADD_MENU_ID = 'ADD_MENU_ID',
	SELECTED_TRIGGER_ID = 'SELECTED_TRIGGER_ID',
	CLEAR_SELECTED_TRIGGER_ID = 'CLEAR_SELECTED_TRIGGER_ID',
}
