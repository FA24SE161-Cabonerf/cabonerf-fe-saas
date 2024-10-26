class AUTH_ENDPOINT {
	public static LOGIN = 'users/login';
	public static LOGOUT = 'users/logout';
	public static REGISTER = 'users/register';
	public static VERIFY_EMAIL = 'users/email-verify';
}

class IMPACT {
	public static IMPACT = '/impacts';
}

class IMPACT_ENDPOINT {
	public static GET_LIST_IMPACT_METHOD = IMPACT.IMPACT + '/impact-methods';

	public static GET_IMPACT_CATEGORIES_BY_METHOD_ID(id: string) {
		return IMPACT.IMPACT + `/impact-methods/:${id}/categories`;
	}
}

export { AUTH_ENDPOINT, IMPACT_ENDPOINT, IMPACT };
