import AuthenticationMessages from '@/constants/validation.msg';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: AuthenticationMessages.LOGIN.EMAIL }).trim(),
	password: z
		.string({ message: AuthenticationMessages.LOGIN.REQUIRED })
		.min(1, { message: AuthenticationMessages.LOGIN.REQUIRED }),
});

export type tLoginSchema = z.infer<typeof loginSchema>;
