import { JWTPayload } from '@/@types/common.type';

export const logoSymbol = `                                                                                                                                                                                          
     ......                .+++-.                                                             .=***-
  .+#@@@@@@*-.             :@@@=.                                                           .+@@@@@=
.+@@@@@@@@@@@=.  ..::..    :@@@=..:..        .::..    .......::..      ..::..    -%%- .:-=-.-%@@#:..
+@@@#.    .=. .#@@@@@@@@=. :@@@@@@@@@@=. .+@@@@@@@@+. -@@@@@@@@@@=. .=%@@@@@@@-. *@@%====+-*@@@@@@@:
%@@@:.         .*=::-%@@@=.:@@@@+:-#@@@+.*@@@*--*@@@*.-@@@@*=+@@@@..=@@@=..=@@@*.*@@@*===:.-*@@@%++.
#@@@-.        .-#%@@@@@@@=.:@@@=.  -%@@@-%@@%.  .%@@%--@@@*. .=@@@:.#@@@@@@@@@@#.*@@@+      -@@@#.  
:@@@@*:..:#@=.=@@@*..+@@@=.:@@@%:..+@@@#:#@@@-..=@@@#.-@@@+. .=@@@:.+@@@-...:..  *@@@+      -@@@#.  
..*@@@@@@@@@%=:%@@@@@@@@@=.:@@@@@@@@@@*. :*@@@@@@@@*. -@@@+. .=@@@: .=@@@@@@@@#. *@@@+      -@@@#.  
  ..=#%@%#*:.  .+###+:###- .###=+###+:.   ..+####=.   :###=. .-###.   .-*#%#*-.  =##*-      :*##+.                                                                                                
                                                                                                    `;

export const disableCopyPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
	event.preventDefault();
};

export const getPayload = (token: string): JWTPayload => {
	const myPayload = token.split('.')[1];

	return JSON.parse(atob(myPayload));
};

export const formatDate = (inputDate: string): string => {
	const date = new Date(inputDate);
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
	return date.toLocaleDateString('en-US', options);
};

type CustomSVG = {
	svgString: string;
	properties?: {
		width: number;
		height: number;
		fill: string;
		color: string;
		strokeWidth?: number;
	};
};

export const updateSVGAttributes = ({ svgString, properties }: CustomSVG) => {
	if (properties)
		return svgString
			.replace(/width="\d+"/, `width="${properties?.width}"`)
			.replace(/height="\d+"/, `height="${properties?.height}"`)
			.replace(/fill="[^"]*"/, `fill="${properties?.fill}"`)
			.replace(/stroke="[^"]*"/, `stroke="${properties?.color}"`)
			.replace(/stroke-width="[^"]*"/, `stroke-width=${properties.strokeWidth}`);
	else return svgString;
};

export function formatWithExponential(value, decimalPlaces = 2) {
	const largeThreshold = 1e5;
	const smallThreshold = 1e-3;

	if (Math.abs(value) >= largeThreshold || (Math.abs(value) < smallThreshold && Math.abs(value) !== 0)) {
		return value.toExponential(decimalPlaces);
	}

	return parseFloat(value.toFixed(decimalPlaces));
}

export function formatPercentage(value: number) {
	if (value % 1 === 0) return value;

	if (value >= 100) return Math.round(value);

	return Math.round(value * 10) / 10;
}

export function areObjectsDifferent(obj1, obj2) {
	if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
		return obj1 !== obj2;
	}

	const keys1 = Object.keys(obj1);
	const keys2 = Object.keys(obj2);

	if (keys1.length !== keys2.length) {
		return true;
	}

	for (const key of keys1) {
		if (!keys2.includes(key) || areObjectsDifferent(obj1[key], obj2[key])) {
			return true;
		}
	}

	return false;
}

type Contributor = {
	processId: string;
	net: number;
	subProcesses: Contributor[];
};

type TransformContributor = {
	processId: string;
	net?: number;
	total?: number;
	subProcesses: TransformContributor[];
};

export function transformProcesses(contributor: Contributor): TransformContributor {
	const hasSubProcesses = contributor.subProcesses.length > 0;

	const newProcess: TransformContributor = {
		processId: contributor.processId,
		subProcesses: [],
	};

	if (hasSubProcesses) {
		newProcess.total = 0;

		newProcess.subProcesses.push({
			processId: contributor.processId,
			net: contributor.net,
			subProcesses: [],
		});

		newProcess.subProcesses.push(...contributor.subProcesses.map((subProcess) => transformProcesses(subProcess)));
	} else {
		newProcess.net = contributor.net;
	}

	return newProcess;
}
