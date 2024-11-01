import { ImpactCategory } from '@/@types/impactCategory.type';
import { ImpactMethod } from '@/@types/impactMethod.type';

interface ImpactProcess {
	id: string;
	unitLevel: number;
	systemLevel: number;
	overallImpactContribution: number;
	method: Omit<ImpactMethod, 'description' | 'reference'>;
	impactCategory: Omit<ImpactCategory, 'indicatorDescription' | 'indicator' | 'unit' | 'emissionCompartment'>;
}

export type { ImpactProcess };
