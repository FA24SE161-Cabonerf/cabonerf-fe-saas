const AuthenticationMessages = {
	LOGIN: {
		REQUIRED: 'Field cannot be empty.',
		EMAIL: 'Enter a valid email.',
	},
	REGISTER: {
		REQUIRED: 'Field cannot be empty.',
		EMAIL: 'Enter a valid email.',
		FULL_NAME_MIN_LTH: 'Full name must be at least 3 characters.',
		FULL_NAME_MAX_LTH: 'Full name must be no more than 50 characters.',
		FULL_NAME_CAPITAL: 'Full name must start with a capital letter.',
		FULL_NAME_SPECIAL_CHAR: 'Full name must not contain special characters or numbers.',
		PASSWORD: 'Password must be at least 6 characters.',
		PASSWORD_REGEX: 'Password must contain a lowercase, uppercase, number symbol.',
		PASSWORD_CONFIRM: 'Passwords do not match.',
	},
};

export default AuthenticationMessages;
