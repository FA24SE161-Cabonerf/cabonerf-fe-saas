import AuthenticationMessages from '@/constants/validation.msg';
import { z } from 'zod';

// Full Name cannot be empty
// Full name must contain at least 3 characters and no more than 50 characters
// Full Name must start with a capital letter and not contain special characters or numbers

export const registerSchema = z
	.object({
		email: z.string().email({ message: AuthenticationMessages.REGISTER.EMAIL }).trim(),
		fullName: z
			.string()
			.min(3, { message: AuthenticationMessages.REGISTER.FULL_NAME_MIN_LTH })
			.max(50, { message: AuthenticationMessages.REGISTER.FULL_NAME_MAX_LTH })
			.regex(/^[A-Z]/, {
				message: AuthenticationMessages.REGISTER.FULL_NAME_CAPITAL,
			})
			.regex(/^[A-Za-zÀ-ỹ\s]*$/, {
				message: AuthenticationMessages.REGISTER.FULL_NAME_SPECIAL_CHAR,
			}),
		password: z
			.string({ message: AuthenticationMessages.REGISTER.REQUIRED })
			.min(6, { message: AuthenticationMessages.REGISTER.PASSWORD })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
				message: AuthenticationMessages.REGISTER.PASSWORD_REGEX,
			}),
		confirmPassword: z.string(),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				message: AuthenticationMessages.REGISTER.PASSWORD_CONFIRM,
				path: ['confirmPassword'],
				code: 'custom',
			});
		}
	});

export type tRegisterSchema = z.infer<typeof registerSchema>;
