import { tImpactCategory, tMidPointImpactCategory } from '@/@types/impact.type';
import { tPerspective } from '@/@types/impactMethod.type';

type tMethod = {
	id: number;
	name: string;
	version: string;
	perspective: Omit<tPerspective, 'description'>;
};

type tWorkSpace = {
	id: number;
	name: string;
};

type tOwnerProject = {
	id: number;
	name: string;
	email: string;
	profilePictureUrl: string;
};

type tProjectUnit = {
	id: number;
	name: string;
};

type tProjectImpact = {
	id: number;
	value: number;
	method: tMethod;
	impactCategory: Omit<
		tImpactCategory<Omit<tMidPointImpactCategory, 'description'>>,
		'indicator' | 'indicatorDescription' | 'unit'
	>;
	unit: tProjectUnit;
};

type tProject = {
	id: number;
	name: string;
	description: string;
	location: string;
	method: tMethod;
	modifiedAt: string;
	owner: tOwnerProject;
	workspace: tWorkSpace;
	impacts: tProjectImpact[];
};

export type {
	tImpactCategory,
	tMethod,
	tMidPointImpactCategory,
	tOwnerProject,
	tPerspective,
	tProject,
	tProjectImpact,
	tProjectUnit,
	tWorkSpace,
};
