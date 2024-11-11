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
	};
};

export const updateSVGAttributes = ({ svgString, properties }: CustomSVG) => {
	if (properties)
		return svgString
			.replace(/width="\d+"/, `width="${properties?.width}"`)
			.replace(/height="\d+"/, `height="${properties?.height}"`)
			.replace(/fill="[^"]*"/, `fill="${properties?.fill}"`)
			.replace(/stroke="[^"]*"/, `stroke="${properties?.color}"`);
	else return svgString;
};

export function formatWithExponential(value, decimalPlaces = 2) {
	// Ngưỡng cho khi nào sử dụng ký hiệu số mũ
	const largeThreshold = 1e5; // Cho các số >= 100,000
	const smallThreshold = 1e-3; // Cho các số < 0.001

	// Chuyển đổi sang ký hiệu số mũ nếu giá trị quá lớn hoặc quá nhỏ
	if (Math.abs(value) >= largeThreshold || (Math.abs(value) < smallThreshold && Math.abs(value) !== 0)) {
		return value.toExponential(decimalPlaces);
	}

	// Làm tròn số đến 2 chữ số thập phân cuối nếu nằm trong phạm vi thông thường
	return parseFloat(value.toFixed(decimalPlaces));
}
