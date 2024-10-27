class AUTH_ENDPOINT {
	public static LOGIN = 'users/login';
	public static LOGOUT = 'users/logout';
	public static REGISTER = 'users/register';
	public static VERIFY_EMAIL = 'users/email-verify';
}

class IMPACT_ENDPOINT {
	public static IMPACT = '/impacts';
}

class IMPACT_METHOD_ENDPOINT {
	public static IMPACT_METHODS = '/impact-methods';
	public static GET_IMPACT_METHODS = IMPACT_ENDPOINT.IMPACT + this.IMPACT_METHODS;
}

class IMPACT_METHOD_CATEGORIES_ENDPOINT {
	public static IMPACT_CATEGORIES = '/impact-categories';

	public static GET_IMPACT_CATEGORIES_BY_METHOD_ID(id: string) {
		return IMPACT_ENDPOINT.IMPACT + IMPACT_METHOD_ENDPOINT.IMPACT_METHODS + `/${id}` + this.IMPACT_CATEGORIES;
	}
}

class PROJECT_ENDPOINT {
	public static PROJECT = '/projects';

	public static CREATE_NEW_PROJECT = this.PROJECT;
}

export { AUTH_ENDPOINT, IMPACT_METHOD_ENDPOINT, IMPACT_ENDPOINT, IMPACT_METHOD_CATEGORIES_ENDPOINT, PROJECT_ENDPOINT };
