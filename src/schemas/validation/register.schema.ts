import AuthenticationMessages from '@/constants/validation.msg';
import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().email({ message: AuthenticationMessages.REGISTER.EMAIL }).trim(),
		full_name: z.string().min(3, { message: AuthenticationMessages.REGISTER.FULL_NAME }),
		password: z
			.string({ message: AuthenticationMessages.REGISTER.REQUIRED })
			.min(6, { message: AuthenticationMessages.REGISTER.PASSWORD }),
		confirm_password: z.string(),
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				message: AuthenticationMessages.REGISTER.PASSWORD_CONFIRM,
				path: ['confirm_password'],
				code: 'custom',
			});
		}
	});

export type tRegisterSchema = z.infer<typeof registerSchema>;
