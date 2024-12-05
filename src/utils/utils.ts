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

export function transformProcessesv2(contributor: Contributor): TransformContributor {
	const hasSubProcesses = contributor.subProcesses.length > 0;

	const newProcess: TransformContributor = {
		processId: contributor.processId,
		subProcesses: [],
	};

	if (hasSubProcesses) {
		newProcess.total = 0;

		// Duyệt qua từng subProcess và thêm key processEnd
		newProcess.subProcesses = contributor.subProcesses.map((subProcess) => {
			const transformedSubProcess = transformProcessesv2(subProcess);
			return {
				...transformedSubProcess,
				processEnd: contributor.processId, // Thêm processEnd với giá trị processId của cha
			};
		});
	} else {
		newProcess.net = contributor.net;
	}

	return newProcess;
}

type Contributor = {
	processId: string;
	net: number;
	subProcesses: Contributor[];
};

export function transformNetToTotal(data: Contributor): TransformContributor {
	const hasSubProcesses = data.subProcesses && data.subProcesses.length > 0;

	// Tạo bản sao mới của dữ liệu và xử lý đệ quy các `subProcesses`
	const transformedData: TransformContributor = {
		processId: data.processId,
		subProcesses: hasSubProcesses ? data.subProcesses.map((subProcess) => transformNetToTotal(subProcess)) : [],
	};

	if (hasSubProcesses) {
		// Nếu có `subProcesses`, đổi `net` thành `total`
		transformedData.total = data.net;
	} else {
		// Nếu không có `subProcesses`, giữ lại `net`
		transformedData.net = data.net;
	}

	return transformedData;
}

export function formatNumberExponential(value: number, threshold: number = 1_000): string {
	// Trường hợp đặc biệt: Giá trị bằng 0
	if (value === 0) {
		return '0';
	}

	// Trường hợp số nhỏ hơn ngưỡng và không cần ký hiệu khoa học
	if (Math.abs(value) < threshold) {
		// Làm tròn tối đa 2 chữ số thập phân, loại bỏ .00 nếu không cần thiết
		return parseFloat(value.toFixed(2)).toString();
	}

	// Trường hợp số lớn hơn hoặc rất nhỏ (bao gồm cả số âm)
	const exponent = Math.floor(Math.log10(Math.abs(value))); // Tìm số mũ
	const base = value / Math.pow(10, exponent); // Tính phần cơ số

	// Dạng ký hiệu khoa học với làm tròn đến 2 chữ số thập phân
	return `${value > 0 ? '+' : ''}${parseFloat(base.toFixed(2))} · 10<sup>${exponent}</sup>`;
}

export function calculatePercentageDifference(value1: number, value2: number, baseValue: 'value1' | 'value2'): number {
	// Xác định giá trị base
	const base = baseValue === 'value1' ? value1 : value2;

	// Xử lý trường hợp base bằng 0
	if (base === 0) {
		// Nếu base = 0 và giá trị kia khác 0, coi là thay đổi 100%
		return 100;
	}

	// Tính chênh lệch tuyệt đối
	const difference = Math.abs(value1 - value2);

	// Tính phần trăm chênh lệch
	return (difference / base) * 100;
}

export function formatPercentage2(value: number, decimalPlaces: number = 1): string {
	const rounded = value.toFixed(decimalPlaces);
	return `${rounded}%`;
}

export function formatLargeNumber(num: number): string {
	if (num >= 1e9) {
		return (num / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B'; // Tỷ (Billion)
	} else if (num >= 1e6) {
		return (num / 1e6).toFixed(2).replace(/\.?0+$/, '') + 'M'; // Triệu (Million)
	} else if (num >= 1e3) {
		return (num / 1e3).toFixed(2).replace(/\.?0+$/, '') + 'K'; // Ngàn (Thousand)
	} else {
		return num.toString(); // Số nhỏ hơn 1,000 không thay đổi
	}
}
export function stringToColor(str: string) {
	let colour = '#';
	let hash = 0;

	for (const char of str) {
		hash = char.charCodeAt(0) + (hash << 5) - hash;
	}

	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		colour += value.toString(16).substring(-2);
	}

	return colour.substring(0, 7);
}
