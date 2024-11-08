import { EmissionSubstances } from '@/@types/emissionSubstance.type';

export const substances: EmissionSubstances[] = [
	{
		id: '01249052-d4de-4ced-b0a8-7eea0d469364',
		emissionSubstance: {
			id: '835bb904-05fe-4bc2-b05a-857a20c249c3',
			name: 'Potash*',
			chemicalName: '',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: '2c5594b5-fdb3-481b-9f95-1097c6f5b53e',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174115',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174015',
						name: 'Resource Scarity Mineral',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174015',
							name: 'Surplus Ore Potential',
							abbr: 'SOP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174010',
								name: 'kg Cu-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '6.93e-02',
				decimalValue: 0.07,
			},
		],
	},
	{
		id: '014ca248-737b-4356-aef8-14115cca73b6',
		emissionSubstance: {
			id: 'b5549701-d024-44c7-9d67-a25179c36efe',
			name: 'Natural gas',
			chemicalName: '',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: 'c404f673-6d8f-4ee5-99a2-2028ae1d6280',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174116',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174016',
						name: 'Resource Scarity Fossil',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flask-round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><path d="M5.52 16h12.96"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174016',
							name: 'Fossil Fuel Potential',
							abbr: 'FFP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174011',
								name: 'kg oil-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '8.40e-01',
				decimalValue: 0.84,
			},
		],
	},
	{
		id: '03098ab7-f6ff-4f44-b30e-6314ef30ab95',
		emissionSubstance: {
			id: 'ae7f387f-1a5e-4f60-8247-492f090c3fb0',
			name: 'Silicon*',
			chemicalName: '',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: '02c91b63-67f2-411a-8105-b95679813015',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174115',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174015',
						name: 'Resource Scarity Mineral',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174015',
							name: 'Surplus Ore Potential',
							abbr: 'SOP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174010',
								name: 'kg Cu-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '3.18e-01',
				decimalValue: 0.32,
			},
		],
	},
	{
		id: '07f0e034-0ff9-470d-afd4-051bbb7d9d31',
		emissionSubstance: {
			id: '7cb8b48b-998d-48e6-a40a-47879e4d86d0',
			name: 'Palladium*',
			chemicalName: 'Pd',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: 'b02097ed-2a1b-4eb9-a3d1-924d6135b389',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174115',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174015',
						name: 'Resource Scarity Mineral',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174015',
							name: 'Surplus Ore Potential',
							abbr: 'SOP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174010',
								name: 'kg Cu-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '6.37e+03',
				decimalValue: 6373.2,
			},
		],
	},
	{
		id: '0835e4ca-e502-4481-ab41-5921df86ef5c',
		emissionSubstance: {
			id: '27bd072a-e8d3-4b5b-95e3-43e00513950f',
			name: 'Garnets*',
			chemicalName: '',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: '4f4a7645-562e-444f-a28f-e1a69da407d9',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174115',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174015',
						name: 'Resource Scarity Mineral',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174015',
							name: 'Surplus Ore Potential',
							abbr: 'SOP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174010',
								name: 'kg Cu-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '2.99e-02',
				decimalValue: 0.03,
			},
		],
	},
	{
		id: '093173c8-1e45-4d1a-91ba-b3d4e0f4f0c0',
		emissionSubstance: {
			id: 'f9385826-81f9-4455-97f6-c1277e75cb74',
			name: 'Iodine*',
			chemicalName: 'I',
			molecularFormula: '',
			alternativeFormula: '',
			cas: '-',
		},
		emissionCompartment: {
			id: '423e4567-e89b-12d3-a456-426614174011',
			name: 'Natural Resource',
			description: '',
		},
		factors: [
			{
				id: 'd88fd368-286b-41f6-b25b-fb9a59f2a331',
				impactMethodCategory: {
					id: '123e4567-e89b-12d3-a456-426614174115',
					lifeCycleImpactAssessmentMethod: {
						id: '923e4567-e89b-12d3-a456-426614174000',
						name: 'ReCiPe 2016 Midpoint',
						description: '',
						version: 'v1.03',
						reference: '',
						perspective: {
							id: '523e4567-e89b-12d3-a456-426614174000',
							name: 'Individualist',
							abbr: 'I',
						},
					},
					impactCategory: {
						id: '123e4567-e89b-12d3-a456-426614174015',
						name: 'Resource Scarity Mineral',
						iconUrl:
							'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pickaxe"><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"/><path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"/><path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"/></svg>',
						midpointImpactCategory: {
							id: '234e4567-e89b-12d3-a456-426614174015',
							name: 'Surplus Ore Potential',
							abbr: 'SOP',
							unit: {
								id: '723e4567-e89b-12d3-a456-426614174010',
								name: 'kg Cu-Eq',
							},
						},
						emissionCompartment: null,
					},
				},
				scientificValue: '6.51e+00',
				decimalValue: 6.51,
			},
		],
	},
];
