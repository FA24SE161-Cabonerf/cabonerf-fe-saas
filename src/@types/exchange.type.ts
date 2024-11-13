import { EmissionSubstance } from '@/@types/emissionSubstance.type';

type CreateElementaryExchange = {
	processId: string;
	emissionSubstanceId: string;
	input: string;
};

type CreateProductExchange = {
	processId: string;
	name: string;
	input: string;
};

type UnitGroup = {
	id: string;
	name: string;
	unitGroupType: string;
};

type Unit = {
	id: string;
	name: string;
	conversionFactor: number;
	unitGroup: UnitGroup;
	isDefault: boolean;
};

export type Exchange = {
	id: string;
	value: number;
	name: string;
	exchangesType: {
		id: string;
		name: string;
	};
	emissionSubstance: EmissionSubstance;
	unit: Unit;
	input: boolean;
};

export type { CreateElementaryExchange, Unit, UnitGroup, CreateProductExchange };
