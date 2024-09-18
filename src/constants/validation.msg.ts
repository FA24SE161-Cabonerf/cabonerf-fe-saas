const AuthenticationMessages = {
	LOGIN: {
		REQUIRED: 'This field cannot be empty.',
		EMAIL: 'Please enter a valid email address.',
	},
	REGISTER: {
		REQUIRED: 'This field cannot be empty.',
		EMAIL: 'Please enter a valid email address.',
		FULL_NAME: 'Full name must contain at least 3 characters.',
		PASSWORD: 'Password must contain at least 6 characters.',
		PASSWORD_CONFIRM: 'The passwords do not match. Please try again.',
	},
};

export default AuthenticationMessages;
