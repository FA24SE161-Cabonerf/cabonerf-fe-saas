type CreateElementaryExchange = {
	processId: string;
	emissionSubstanceId: string;
	input: boolean;
};

export type Exchange = {
	id: string;
	value: number;
	name: string;
	exchangesType: {
		id: string;
		name: string;
	};
	substancesCompartments: string;
	unit: {
		id: string;
		name: string;
		conversionFactor: number;
		unitGroup: {
			id: string;
			name: string;
			unitGroupType: string;
		};
		isDefault: boolean;
	};
	input: boolean;
};

export type { CreateElementaryExchange };
