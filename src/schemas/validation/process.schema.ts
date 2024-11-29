import { z } from 'zod';

export const lifeCycleStagesSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	iconUrl: z.string().url(), // Validate iconUrl as a valid URL string
});

type LifeCycleStage = z.infer<typeof lifeCycleStagesSchema>;

export const processSchema = z.object({
	name: z.string().trim(),
	description: z.string().optional(),
	lifeCycleStage: z.custom<LifeCycleStage>(),
});

export type ProcessSchema = z.infer<typeof processSchema>;
