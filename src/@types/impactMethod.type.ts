interface Perspective {
	id: number;
	name: string;
	abbr: string;
}

interface ImpactMethod {
	id: string;
	name: string;
	description: string;
	version: string;
	reference: string;
	perspective: Perspective;
}

export type { Perspective, ImpactMethod };
