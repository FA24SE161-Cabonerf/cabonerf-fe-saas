export enum eQueryObjectLibraryParam {
	MODIFY_QUERY_PARAMS = 'MODIFY_QUERY_PARAMS',
}

type QueryParams = {
	organizationId: string;
	systemBoundaryId?: string;
};

type Action = {
	type: eQueryObjectLibraryParam.MODIFY_QUERY_PARAMS;
	payload: Omit<QueryParams, 'organizationId'>;
};

export const reducer = (state: QueryParams, action: Action) => {
	switch (action.type) {
		case eQueryObjectLibraryParam.MODIFY_QUERY_PARAMS:
			return { ...state, ...action.payload };
		default:
			return state;
	}
};
