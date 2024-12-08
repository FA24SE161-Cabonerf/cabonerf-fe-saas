import { z } from 'zod';

export const handleProductItemSchema = z.object({
	name: z.string().optional(),
	unit: z.object({
		id: z.string(),
		name: z.string(),
		conversionFactor: z.number(),
		unitGroup: z.object({
			id: z.string(),
			name: z.string(),
			unitGroupType: z.string(),
		}),
		isDefault: z.boolean(),
	}),
	value: z.string().optional(),
	processId: z.string(),
});

export type HandleProductItemSchema = z.infer<typeof handleProductItemSchema>;
