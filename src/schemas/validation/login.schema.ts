import authenticationMsg from '@/constants/validation.msg';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: authenticationMsg.LOGIN.EMAIL }).trim(),
	password: z
		.string({ message: authenticationMsg.LOGIN.REQUIRED })
		.min(1, { message: authenticationMsg.LOGIN.REQUIRED }),
});

export type tLoginSchema = z.infer<typeof loginSchema>;
