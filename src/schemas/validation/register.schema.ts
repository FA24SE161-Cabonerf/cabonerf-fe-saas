import authenticationMsg from '@/constants/validation.msg';
import { z } from 'zod';

export const registerSchema = z
	.object({
		email: z.string().email({ message: authenticationMsg.REGISTER.EMAIL }).trim(),
		full_name: z.string().min(3, { message: authenticationMsg.REGISTER.FULL_NAME }),
		password: z
			.string({ message: authenticationMsg.REGISTER.REQUIRED })
			.min(6, { message: authenticationMsg.REGISTER.PASSWORD }),
		confirm_password: z.string(),
	})
	.superRefine(({ confirm_password, password }, ctx) => {
		if (confirm_password !== password) {
			ctx.addIssue({
				message: authenticationMsg.REGISTER.PASSWORD_CONFIRM,
				path: ['confirm_password'],
				code: 'custom',
			});
		}
	});

export type tRegisterSchema = z.infer<typeof registerSchema>;
