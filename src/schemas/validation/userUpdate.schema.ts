import AuthenticationMessages from '@/constants/validation.msg';
import { z } from 'zod';

export const userUpdateSchema = z.object({
	fullName: z.string().min(1, 'Full name is required'), // Ensures it's a non-empty string
	bio: z.string().optional(), // Allows the bio to be optional
	phone: z
		.string()
		.regex(/^(?:\+?[1-9]\d{1,14}|0\d{9,10})$/, 'Invalid phone number') // Supports E.164 or local numbers with leading 0
		.or(z.literal('')) // Allow an empty string
		.optional(), // Optional phone field
});

export const changePasswordSchema = z
	.object({
		oldPassword: z.string().min(1, 'Do not let empty'),
		newPassword: z
			.string({ message: AuthenticationMessages.REGISTER.REQUIRED })
			.min(6, { message: AuthenticationMessages.REGISTER.PASSWORD })
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
				message: AuthenticationMessages.REGISTER.PASSWORD_REGEX,
			}),
		newPasswordConfirm: z.string(),
	})
	.superRefine(({ newPasswordConfirm, newPassword }, ctx) => {
		if (newPasswordConfirm !== newPassword) {
			ctx.addIssue({
				message: AuthenticationMessages.REGISTER.PASSWORD_CONFIRM,
				path: ['newPasswordConfirm'],
				code: 'custom',
			});
		}
	});

export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
