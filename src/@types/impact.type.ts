export type tPerspective = {
	id: number;
	name: string;
	description: string;
	abbr: string;
};

export type tImpactAssessmentMethod = {
	id: number;
	name: string;
	description: string;
	version: string;
	reference: string;
	perspective: tPerspective;
};

export type tImpactCompartment = {
	id: number;
	name: string;
};

export type tUnitGroupMidpointImpactCategory = {
	id: number;
	name: string;
	unitGroupType: string;
};

export type tUnitMidpointImpactCategory = {
	id: number;
	name: string;
	conversionFactor: number;
	unitGroup: tUnitGroupMidpointImpactCategory;
	default: boolean;
};

export type tMidPointImpactCategory = {
	id: number;
	name: string;
	description: string;
	abbr: string;
};

export type tImpactCategory<tData = tMidPointImpactCategory> = {
	id: number;
	name: string;
	indicator: string;
	indicatorDescription: string;
	unit: string;
	midpointImpactCategory: tData;
	iconUrl: string;
};
