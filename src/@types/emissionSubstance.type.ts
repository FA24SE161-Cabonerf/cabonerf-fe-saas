import { ImpactCategory } from '@/@types/impactCategory.type';
import { ImpactMethod } from '@/@types/impactMethod.type';

interface CharacterizationFactor {
	id: string;
	impactMethodCategory: {
		id: string;
		lifeCycleImpactAssessmentMethod: ImpactMethod;
		impactCategory: Omit<ImpactCategory, 'indicator' | 'indicatorDescription'>;
	};
	scientificValue: string;
	decimalValue: number;
}

interface EmissionSubstance {
	id: string;
	substance: {
		id: string;
		name: string;
		cas: string;
		chemicalName: string;
		molecularFormula: string;
		alternativeFormula: string;
	};
	emissionCompartment: {
		id: string;
		name: string;
		description: string;
	};
	factors: CharacterizationFactor[];
}

export type { CharacterizationFactor, EmissionSubstance };
