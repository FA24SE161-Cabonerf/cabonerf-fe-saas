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

export const data: Exchange[] = [
	{
		id: 'a',
		exchangesType: {
			id: '1',
			name: '2',
		},
		input: false,
		name: 'Methane',
		substancesCompartments: 'Air',
		unit: {
			id: 'azc',
			conversionFactor: 1,
			isDefault: true,
			name: 'kg',
			unitGroup: {
				id: 'a',
				unitGroupType: 'Normal',
				name: 'Unit of Mass',
			},
		},
		value: 10,
	},
	{
		id: 'ab',
		exchangesType: {
			id: '1',
			name: '2',
		},
		input: false,
		name: 'Methane',
		substancesCompartments: 'Air',
		unit: {
			id: 'azc',
			conversionFactor: 1,
			isDefault: true,
			name: 'kg',
			unitGroup: {
				id: 'a',
				unitGroupType: 'Normal',
				name: 'Unit of Mass',
			},
		},
		value: 10,
	},
	{
		id: 'abs',
		exchangesType: {
			id: '1',
			name: '2',
		},
		input: false,
		name: 'Methane',
		substancesCompartments: 'Air',
		unit: {
			id: 'azc',
			conversionFactor: 1,
			isDefault: true,
			name: 'kg',
			unitGroup: {
				id: 'a',
				unitGroupType: 'Normal',
				name: 'Unit of Mass',
			},
		},
		value: 10,
	},
	{
		id: 'acb',
		exchangesType: {
			id: '1',
			name: '2',
		},
		input: false,
		name: 'Methane',
		substancesCompartments: 'Air',
		unit: {
			id: 'azc',
			conversionFactor: 1,
			isDefault: true,
			name: 'kg',
			unitGroup: {
				id: 'a',
				unitGroupType: 'Normal',
				name: 'Unit of Mass',
			},
		},
		value: 10,
	},
	{
		id: 'abz',
		exchangesType: {
			id: '1',
			name: '2',
		},
		input: false,
		name: 'Methane',
		substancesCompartments: 'Air',
		unit: {
			id: 'azc',
			conversionFactor: 1,
			isDefault: true,
			name: 'kg',
			unitGroup: {
				id: 'a',
				unitGroupType: 'Normal',
				name: 'Unit of Mass',
			},
		},
		value: 10,
	},
];
