const a = {
	id: '9d609007-91a5-45ef-aad3-73c18c53af1f',
	name: 'New Process 3',
	description: '',
	lifeCycleStage: {
		id: '823e4567-e89b-12d3-a456-426614174001',
		name: 'Production',
		description: 'From input materials to output products of the production facility.',
		iconUrl: null,
	},
	overallProductFlowRequired: null,
	exchanges: [
		{
			id: 'c0068ac3-9623-4539-bccf-91a21ed355c8',
			name: 'Product Output',
			value: 1,
			exchangesType: {
				id: '723e4567-e89b-12d3-a456-426614174000',
				name: 'Product', //Elementary (In: true / Out: false) | Product (In:true/ Out:false)
			},
			input: false,
		},
		{
			id: '123068ac3-9623-4539-bccf-91a21ed355c8',
			name: 'Product Output',
			value: 1,
			exchangesType: {
				id: '723e4567-e89b-12d3-a456-426614174000',
				name: 'Product', //Elementary (In: true / Out: false) | Product (In:true/ Out:false)
			},
			unit: {
				id: '723e4567-e89b-12d3-a456-426614174012',
				name: 'kg',
				conversionFactor: 1,
				unitGroup: {
					id: '623e4567-e89b-12d3-a456-426614174001',
					name: 'Unit of mass',
					unitGroupType: 'Normal',
				},
				default: false,
			},
			input: true,
		},
		{
			id: 'c0068ac3-9623-4539-bccf-91a21ed355c8',
			name: 'Product Output',
			value: 1,
			exchangesType: {
				id: '723e4567-e89b-12d3-a456-426614174000',
				name: 'Product', //Elementary (In: true / Out: false) | Product (In:true/ Out:false)
			},
			input: true,
		},
	],
};
