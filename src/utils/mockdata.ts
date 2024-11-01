import { ImpactProcess } from '@/@types/impactProcess.type';
import { Position } from '@xyflow/react';

export const process = {
	id: '3d6f28e8-a86b-4980-91e2-6789f535d191',
	data: {
		id: '3d6f28e8-a86b-4980-91e2-6789f535d191',
		name: 'New process',
		lifeCycleStages: {
			id: '823e4567-e89b-12d3-a456-426614174001',
			name: 'Production',
			iconUrl:
				'<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-factory"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>',
		},
	},
	position: {
		x: 600,
		y: 450,
	},
	initialWidth: 400,
	type: 'process',
	sourcePosition: 'right' as Position,
	selectable: true,
	draggable: true,
};

export const processImpacts: ImpactProcess[] = [
	{
		id: '439ff186-eee8-4fbd-9bcb-54e8c87807e3',
		unitLevel: 0.345457692640615,
		systemLevel: 0.9622171001180908,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174000',
			name: 'Climate Change',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/thermometer-sun.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174000',
				name: 'Global Warming Potential',
				abbr: 'GWP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174000',
					name: 'kg CO2',
				},
			},
		},
	},
	{
		id: 'a6541d40-b42a-4607-a7c8-6d925668c10d',
		unitLevel: 0.2345642685665975,
		systemLevel: 0.5543843218662687,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174001',
			name: 'Ozone Depletion',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/earth.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174001',
				name: 'Ozone Depletion Potential',
				abbr: 'ODP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174001',
					name: 'kg CFC-11',
				},
			},
		},
	},
	{
		id: 'b84d2d4d-b08a-4721-9f21-703221adb7bf',
		unitLevel: 0.9263638630020319,
		systemLevel: 0.8313618104142443,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174002',
			name: 'Ionizing Radiation',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/radiation.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174002',
				name: 'Ionizing Radiation Potential',
				abbr: 'IRP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174002',
					name: 'kBq Co-60',
				},
			},
		},
	},
	{
		id: 'c4543be1-1eda-414c-b24e-d89d437a6b7e',
		unitLevel: 0.5906098671173919,
		systemLevel: 0.8638969270668709,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174003',
			name: 'Particulate Matter Formation',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/wind.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174003',
				name: 'Particulate Matter Formation Potential',
				abbr: 'PMFP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174003',
					name: 'kg PM2.5',
				},
			},
		},
	},
	{
		id: '48fd21aa-4324-4bfa-b5e8-3120956b59e8',
		unitLevel: 0.6561769650154423,
		systemLevel: 0.8084995963741686,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174004',
			name: 'Photochemical Oxidant Ecosystem',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-sun-rain.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174004',
				name: 'Photochemical Oxidant Formation Potential: Ecosystems',
				abbr: 'EOFP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174004',
					name: 'kg NOx',
				},
			},
		},
	},
	{
		id: '6d39291a-9953-4aa2-a439-4aa9332bd9b5',
		unitLevel: 0.3633271020456581,
		systemLevel: 0.4358450883466781,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174005',
			name: 'Photochemical Oxidant Human',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-sun-rain.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174005',
				name: 'Photochemical Oxidant Formation Potential: Humans',
				abbr: 'HOFP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174004',
					name: 'kg NOx',
				},
			},
		},
	},
	{
		id: '5fa2c505-21b5-4036-b61e-6187f7a39edc',
		unitLevel: 0.8954257599867269,
		systemLevel: 0.1425421725878404,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174006',
			name: 'Acidification Terrestrial',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-rain-wind.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174006',
				name: 'Terrestrial Acidification Potential',
				abbr: 'TAP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174005',
					name: 'kg SO2',
				},
			},
		},
	},
	{
		id: '19a7e38a-9c49-4db4-900d-f0b67a007bc5',
		unitLevel: 0.9694012196204741,
		systemLevel: 0.4135249638559707,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174007',
			name: 'Eutrophication Freshwater',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-off.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174007',
				name: 'Freshwater Eutrophication Potential',
				abbr: 'FEP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174006',
					name: 'kg P',
				},
			},
		},
	},
	{
		id: '92702384-5c45-45d8-aeeb-6e330bd7ae4a',
		unitLevel: 0.5224170688731067,
		systemLevel: 0.5741585046126383,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174008',
			name: 'Human Toxicity Carcinogenic',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/skull.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174008',
				name: 'Human Toxicity Potential',
				abbr: 'HTPc',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174007',
					name: 'kg 1,4-DCB',
				},
			},
		},
	},
	{
		id: 'ce0bce8b-02d6-4cff-b3b7-7cb430f0f877',
		unitLevel: 0.006733656940671073,
		systemLevel: 0.38184681712701196,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174009',
			name: 'Human Toxicity Non-Carcinogenic',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/angry.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174009',
				name: 'Human Toxicity Potential',
				abbr: 'HTPnc',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174007',
					name: 'kg 1,4-DCB',
				},
			},
		},
	},
	{
		id: 'cda927f9-0137-46b4-852c-106cf40f0847',
		unitLevel: 0.17431953584505855,
		systemLevel: 0.7500627593028104,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174010',
			name: 'Ecotoxicity Terrestrial',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/tree-pine.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174010',
				name: 'Terrestrial Ecotoxicity Potential',
				abbr: 'TETP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174007',
					name: 'kg 1,4-DCB',
				},
			},
		},
	},
	{
		id: '85bd4ab8-ee65-4324-abf7-00f24caecab0',
		unitLevel: 0.6501260243290252,
		systemLevel: 0.3663490219163523,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174011',
			name: 'Ecotoxicity Freshwater',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-symbol.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174011',
				name: 'Freshwater Ecotoxicity Potential',
				abbr: 'FETP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174007',
					name: 'kg 1,4-DCB',
				},
			},
		},
	},
	{
		id: '399ba37b-a81a-4f3a-9fc4-aa5c028ec85e',
		unitLevel: 0.11224402466108452,
		systemLevel: 0.830776712562537,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174012',
			name: 'Ecotoxicity Marine',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-symbol.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174012',
				name: 'Marine Ecotoxicity Potential',
				abbr: 'METP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174007',
					name: 'kg 1,4-DCB',
				},
			},
		},
	},
	{
		id: 'd8348395-af7e-4668-aabc-8c2707a2137e',
		unitLevel: 0.9623238090280888,
		systemLevel: 0.5339970866967819,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174013',
			name: 'Land Use',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/droplet.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174013',
				name: 'Argicultural Land Occupation Potential',
				abbr: 'LOP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174008',
					name: 'm2×yr',
				},
			},
		},
	},
	{
		id: '2cbfa9df-3267-47e8-a3a5-8d316f28c2f3',
		unitLevel: 0.5151037531050251,
		systemLevel: 0.7204714126133646,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174014',
			name: 'Water Use',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/trees.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174014',
				name: 'Water Consumption Potential',
				abbr: 'WCP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174009',
					name: 'm3',
				},
			},
		},
	},
	{
		id: '2d9d5c12-166a-47c6-a718-c8893f1e52d3',
		unitLevel: 0.6788177327282153,
		systemLevel: 0.005917088482906396,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174015',
			name: 'Resource Scarity Mineral',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/pickaxe.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174015',
				name: 'Surplus Ore Potential',
				abbr: 'SOP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174010',
					name: 'kg Cu',
				},
			},
		},
	},
	{
		id: 'd8d58653-2cc3-4af1-a31f-b7774ded2bda',
		unitLevel: 0.732331616461719,
		systemLevel: 0.867709171502805,
		overallImpactContribution: 0.0,
		method: {
			id: '923e4567-e89b-12d3-a456-426614174000',
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: '523e4567-e89b-12d3-a456-426614174000',
				name: 'Individualist',
				abbr: 'I',
			},
		},
		impactCategory: {
			id: '123e4567-e89b-12d3-a456-426614174016',
			name: 'Resource Scarity Fossil',
			iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/amphora.svg',
			midpointImpactCategory: {
				id: '234e4567-e89b-12d3-a456-426614174016',
				name: 'Fossil Fuel Potential',
				abbr: 'FFP',
				unit: {
					id: '723e4567-e89b-12d3-a456-426614174011',
					name: 'kg oil',
				},
			},
		},
	},
];
