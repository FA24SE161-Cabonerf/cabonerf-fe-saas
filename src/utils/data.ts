import { tProject } from '@/@types/project.type';

export const mockData: tProject[] = [
	{
		id: 1,
		name: 'New project',
		description: '',
		location: '',
		method: {
			id: 1,
			name: 'ReCiPe 2016 Midpoint',
			version: 'v1.03',
			perspective: {
				id: 1,
				name: 'Individualist',
				abbr: 'I',
			},
		},
		modifiedAt: '2024-10-25',
		owner: {
			id: 1,
			name: 'minh',
			email: 'Admin',
			profilePictureUrl: '',
		},
		workspace: {
			id: 1,
			name: 'Dev',
		},
		impacts: [
			{
				id: 1,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 1,
					name: 'Climate Change',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/thermometer-sun.svg',
					midpointImpactCategory: {
						id: 1,
						name: 'Global Warming Potential',
						abbr: 'GWP',
					},
				},
				unit: {
					id: 1,
					name: 'kg CO2',
				},
			},
			{
				id: 2,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 2,
					name: 'Ozone Depletion',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/earth.svg',
					midpointImpactCategory: {
						id: 2,
						name: 'Ozone Depletion Potential',
						abbr: 'ODP',
					},
				},
				unit: {
					id: 2,
					name: 'kg CFC-11',
				},
			},
			{
				id: 3,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 3,
					name: 'Ionizing Radiation',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/radiation.svg',
					midpointImpactCategory: {
						id: 3,
						name: 'Ionizing Radiation Potential',
						abbr: 'IRP',
					},
				},
				unit: {
					id: 3,
					name: 'kBq Co-60',
				},
			},
			{
				id: 4,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 4,
					name: 'Particulate Matter Formation',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/wind.svg',
					midpointImpactCategory: {
						id: 4,
						name: 'Particulate Matter Formation Potential',
						abbr: 'PMFP',
					},
				},
				unit: {
					id: 4,
					name: 'kg PM2.5',
				},
			},
			{
				id: 5,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 5,
					name: 'Photochemical Oxidant Ecosystem',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-sun-rain.svg',
					midpointImpactCategory: {
						id: 5,
						name: 'Photochemical Oxidant Formation Potential: Ecosystems',
						abbr: 'EOFP',
					},
				},
				unit: {
					id: 5,
					name: 'kg NOx',
				},
			},
			{
				id: 6,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 6,
					name: 'Photochemical Oxidant Human',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-sun-rain.svg',
					midpointImpactCategory: {
						id: 6,
						name: 'Photochemical Oxidant Formation Potential: Humans',
						abbr: 'HOFP',
					},
				},
				unit: {
					id: 5,
					name: 'kg NOx',
				},
			},
			{
				id: 7,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 7,
					name: 'Acidification Terrestrial',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/cloud-rain-wind.svg',
					midpointImpactCategory: {
						id: 7,
						name: 'Terrestrial Acidification Potential',
						abbr: 'TAP',
					},
				},
				unit: {
					id: 6,
					name: 'kg SO2',
				},
			},
			{
				id: 8,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 8,
					name: 'Eutrophication Freshwater',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-off.svg',
					midpointImpactCategory: {
						id: 8,
						name: 'Freshwater Eutrophication Potential',
						abbr: 'FEP',
					},
				},
				unit: {
					id: 7,
					name: 'kg P',
				},
			},
			{
				id: 9,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 9,
					name: 'Human Toxicity Carcinogenic',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/skull.svg',
					midpointImpactCategory: {
						id: 9,
						name: 'Human Toxicity Potential',
						abbr: 'HTPc',
					},
				},
				unit: {
					id: 8,
					name: 'kg 1,4-DCB',
				},
			},
			{
				id: 10,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 10,
					name: 'Human Toxicity Non-Carcinogenic',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/angry.svg',
					midpointImpactCategory: {
						id: 10,
						name: 'Human Toxicity Potential',
						abbr: 'HTPnc',
					},
				},
				unit: {
					id: 8,
					name: 'kg 1,4-DCB',
				},
			},
			{
				id: 11,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 11,
					name: 'Ecotoxicity Terrestrial',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/tree-pine.svg',
					midpointImpactCategory: {
						id: 11,
						name: 'Terrestrial Ecotoxicity Potential',
						abbr: 'TETP',
					},
				},
				unit: {
					id: 8,
					name: 'kg 1,4-DCB',
				},
			},
			{
				id: 12,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 12,
					name: 'Ecotoxicity Freshwater',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-symbol.svg',
					midpointImpactCategory: {
						id: 12,
						name: 'Freshwater Ecotoxicity Potential',
						abbr: 'FETP',
					},
				},
				unit: {
					id: 8,
					name: 'kg 1,4-DCB',
				},
			},
			{
				id: 13,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 13,
					name: 'Ecotoxicity Marine',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/fish-symbol.svg',
					midpointImpactCategory: {
						id: 13,
						name: 'Marine Ecotoxicity Potential',
						abbr: 'METP',
					},
				},
				unit: {
					id: 8,
					name: 'kg 1,4-DCB',
				},
			},
			{
				id: 14,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 14,
					name: 'Land Use',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/droplet.svg',
					midpointImpactCategory: {
						id: 14,
						name: 'Argicultural Land Occupation Potential',
						abbr: 'LOP',
					},
				},
				unit: {
					id: 9,
					name: 'm2×yr',
				},
			},
			{
				id: 15,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 15,
					name: 'Water Use',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/trees.svg',
					midpointImpactCategory: {
						id: 15,
						name: 'Water Consumption Potential',
						abbr: 'WCP',
					},
				},
				unit: {
					id: 10,
					name: 'm3',
				},
			},
			{
				id: 16,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 16,
					name: 'Resource Scarity Mineral',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/pickaxe.svg',
					midpointImpactCategory: {
						id: 16,
						name: 'Surplus Ore Potential',
						abbr: 'SOP',
					},
				},
				unit: {
					id: 11,
					name: 'kg Cu',
				},
			},
			{
				id: 17,
				value: 0.0,
				method: {
					id: 1,
					name: 'ReCiPe 2016 Midpoint',
					version: 'v1.03',
					perspective: {
						id: 1,
						name: 'Individualist',
						abbr: 'I',
					},
				},
				impactCategory: {
					id: 17,
					name: 'Resource Scarity Fossil',
					iconUrl: 'https://s3.ap-southeast-1.amazonaws.com/cabonerf.icon.storage/amphora.svg',
					midpointImpactCategory: {
						id: 17,
						name: 'Fossil Fuel Potential',
						abbr: 'FFP',
					},
				},
				unit: {
					id: 12,
					name: 'kg oil',
				},
			},
		],
	},
];
