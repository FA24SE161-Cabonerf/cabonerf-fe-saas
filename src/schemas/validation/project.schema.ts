import { z } from 'zod';

export const createProjectSchema = z.object({
	name: z.string().trim().min(1, { message: 'Please provide a valid project name.' }),
	description: z.string().trim().min(1, {
		message: 'Please provide a description for the project.',
	}),
	location: z.string().trim().min(1, {
		message: 'Please specify the project location.',
	}),
	methodId: z.string().uuid({ message: 'Please choose one method above.' }),
	organizationId: z.string().uuid({
		message: 'Ensure the workspace ID is correct.',
	}),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

//  "name":"New project",
//  "description":"",
//  "location":"",
//  "methodId": "923e4567-e89b-12d3-a456-426614174000",
//  "workspaceId":"6ccbff7f-9653-44c0-8ddb-e7728f12e5a0"
