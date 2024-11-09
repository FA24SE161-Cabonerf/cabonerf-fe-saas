interface ModifyQueryParams {
	type: 'MODIFY_QUERY_PARAMS';
	payload: QueryParams;
}

type Action = ModifyQueryParams;

interface QueryParams {
	pageSize?: number | undefined;
	pageCurrent?: number | undefined;
	methodId?: string | undefined;
	input?: string | undefined;
	keyword?: string | undefined;
	impactCategoryId?: string | undefined;
	emissionCompartmentId?: string | undefined;
}

const initQueryParams: QueryParams = {
	input: undefined,
	methodId: undefined,
	emissionCompartmentId: undefined,
	impactCategoryId: undefined,
	keyword: undefined,
	pageCurrent: undefined,
	pageSize: undefined,
};

const reducer = (state: QueryParams, action: Action) => {
	switch (action.type) {
		case 'MODIFY_QUERY_PARAMS':
			return { ...state, ...action.payload };
		default:
			return state;
	}
};

export { reducer, initQueryParams };
