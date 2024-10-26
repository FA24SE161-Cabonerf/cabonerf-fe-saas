export type tPerspective = {
	id: number;
	name: string;
	description: string;
	abbr: string;
};

export type tImpactMethod = {
	id: number;
	name: string;
	description: string;
	version: string;
	reference: string;
	perspective: tPerspective;
};
