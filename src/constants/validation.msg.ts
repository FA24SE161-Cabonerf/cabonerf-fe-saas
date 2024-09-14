const authenticationMsg = {
	LOGIN: {
		REQUIRED: 'Do not leave this field blank',
		EMAIL: 'Invalid email address',
	},
	REGISTER: {
		REQUIRED: 'Do not leave this field blank',
		EMAIL: 'Invalid email address',
		FULL_NAME: 'Full name must be at least 3 characters',
		PASSWORD: 'Password must be at least 6 characters',
		PASSWORD_CONFIRM: 'Passwords do not match',
	},
};

export default authenticationMsg;
